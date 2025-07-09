import React from 'react'
import { Provider } from 'react-redux'
import { store } from '../app/store'
import Container from './container'
import type { AppProps } from '../types/Card'
import { Integration, Purpose, Scope } from '../types'
import { sendEventGeneric, validateAppConfig } from '../utils'
import type { configProps, Features } from '../types/configProps'
import { setSaveCardForLater } from '../features/globalSlice'
import { changeHolderNameValue } from '../features/holdernameSlice'
import {
	setCards,
	setConfig,
	setEncryptionKey,
	setPaymentOptions,
	setReferer,
	setTheme,
	fetchLocaleAsync,
	updateLanguage,
	fetchThemeAsync,
	setSaveCardOption,
	setAuthentication,
	setScope,
	setFeatures,
	setPowered,
	setCardCVV,
	setSavedCardCVV
} from '../features/configSlice'

export const App: React.FC<AppProps> = ({
	errorData,
	referer,
	encryptionKey,
	paymentOptions,
	cards,
	configValue,
	themeMode,
	assets,
	session,
	integrationMode,
	permission,
	isNewConfig
}: Readonly<AppProps>) => {
	console.log('App Props:', { integrationMode });

	const [appConfig, setAppConfig] = React.useState<AppProps | null>(null)
	const [ready, setReady] = React.useState(false)
	const isInternally = React.useMemo(() => {
		return integrationMode && [Integration.CHECKOUT, Integration.WEBVIEW].includes(integrationMode) && !!session
	}, [integrationMode, session])
	React.useEffect(() => {
		if (isInternally) return
		const cardsToUse = cards?.map((card) => {
			return {
				...card,
				brand: card.brand.toUpperCase()
			}
		})
		setAppConfig({
			errorData,
			referer,
			encryptionKey,
			paymentOptions,
			cards: cardsToUse ?? [],
			configValue,
			themeMode,
			assets,
			permission,
			isNewConfig
		})
	}, [isInternally])

	const cardProfileMessage = React.useCallback(
		(event: MessageEvent) => {
			if (!isInternally) return
			const { event: type, data } = event.data
			if (!data) return
			if (type === 'cardMetaData') {
				const assests = data.cardMetaData?.assests
				const merchant = data.cardMetaData?.merchant
				const payment_options = data.cardMetaData?.payment_options as {
					cards: AppProps['cards']
					payment_methods: AppProps['paymentOptions']
				}

				// FIXME - checkoutProfile payment_options doesn't include .card.
				const cardsToUse = payment_options.cards?.map((card) => {
					return {
						...card,
						brand: card.brand.toUpperCase()
					}
				})

				setAppConfig({
					errorData,
					referer,
					encryptionKey: merchant.encryption_key,
					paymentOptions: payment_options.payment_methods ?? [],
					cards: cardsToUse ?? [],
					configValue,
					themeMode,
					assets: assests,
					permission: merchant.permission,
					isNewConfig
				})
			}
		},
		[isInternally]
	)

	React.useEffect(() => {
		window.addEventListener('message', cardProfileMessage)
		return () => {
			window.removeEventListener('message', cardProfileMessage)
		}
	}, [cardProfileMessage])

	React.useEffect(() => {
		if (!appConfig) return
		sendEventGeneric(referer ?? '', {
			event: 'dimension',
			data: { height: (appConfig?.configValue?.paymentOptions?.displayPaymentBrands ?? true) ? 95 : 64 }
		})
		if (errorData) {
			sendEventGeneric(referer ?? '', { event: 'error', data: errorData })
			return
		}
		store.dispatch(setReferer(referer ?? ''))
		const dataError = validateAppConfig({
			errorData: appConfig.errorData,
			referer: appConfig.referer,
			encryptionKey: appConfig.encryptionKey,
			paymentOptions: appConfig.paymentOptions,
			cards: appConfig.cards,
			configValue: appConfig.configValue,
			themeMode: appConfig.themeMode,
			assets: appConfig.assets,
			permission: appConfig.permission,
			isNewConfig: appConfig.isNewConfig,
			integrationMode
		})
		if (dataError) {
			sendEventGeneric(referer ?? '', { event: 'error', data: dataError })
			return
		}
		store.dispatch(fetchLocaleAsync(appConfig?.assets!.localisation.card.url))
		store.dispatch(fetchThemeAsync({ url: appConfig?.assets!.theme.card }))
		store.dispatch(setConfig(appConfig?.configValue!))
		store.dispatch(setEncryptionKey(appConfig?.encryptionKey!))
		store.dispatch(setPaymentOptions(appConfig?.paymentOptions!))
		store.dispatch(setCards(appConfig?.cards))
		if (appConfig?.themeMode) store.dispatch(setTheme(appConfig.themeMode))
		if (appConfig?.configValue!.paymentOptions?.locale) {
			store.dispatch(updateLanguage(appConfig.configValue!.paymentOptions.locale))
		}
		if (appConfig?.configValue!.paymentOptions?.preLoadCardName) {
			store.dispatch(changeHolderNameValue(appConfig.configValue!.paymentOptions?.preLoadCardName.toUpperCase()))
		}
		if (!(appConfig?.configValue!.paymentOptions?.cardCVV ?? true)) {
			store.dispatch(setCardCVV(false))
		}
		if (!(appConfig?.configValue!.paymentOptions?.savedCardCVV ?? true)) {
			store.dispatch(setSavedCardCVV(false))
		}
		if (!appConfig?.permission?.card_wallet) {
			store.dispatch(setSaveCardOption('none'))
		}
		if (appConfig?.configValue!.scope) {
			store.dispatch(setScope(appConfig.configValue.scope))
		}
		if (appConfig?.configValue!.features) {
			const features = JSON.parse(appConfig?.configValue?.features as unknown as string) as Features
			store.dispatch(setFeatures(features))
			store.dispatch(setSaveCardForLater(!!features?.customerCards?.autoSaveCard))
		}
		if (appConfig?.configValue!.authentication) {
			const authData = JSON.parse(
				decodeURIComponent(appConfig.configValue.authentication as unknown as string)
			) as NonNullable<configProps['authentication']>
			const isSaveCardHidden = appConfig?.configValue?.paymentOptions?.saveCardOption === 'none'
			let purpose = authData.authentication.purpose
			/**
			 * TODO:- to be removed, when the BE API is ready.
			 */
			const isScopeToken = appConfig?.configValue?.scope === Scope.TOKEN
			if (isScopeToken && purpose === Purpose.SAVE_TOKEN) {
				purpose = Purpose.CHARGE
				authData.authentication.purpose = Purpose.CHARGE
			}
			const isPurposeCharge = purpose === Purpose.CHARGE
			const isPurposeAuthorize = purpose === Purpose.AUTHORIZE
			const isPurposeSaveToken = purpose === Purpose.SAVE_TOKEN

			if (isSaveCardHidden && isPurposeSaveToken) {
				setSaveCardForLater(true)
			}
			if ((isSaveCardHidden && isPurposeCharge) || isPurposeAuthorize) {
				setSaveCardForLater(false)
			}

			authData.currency = authData.currency.toUpperCase()
			authData.order.currency = authData.order.currency.toUpperCase()
			authData.authentication.purpose = authData.authentication.purpose.toUpperCase()
			authData.authentication.channel = authData.authentication.channel.toUpperCase()
			store.dispatch(setAuthentication(authData))
		}
		if (appConfig?.permission?.powered === false) {
			store.dispatch(setPowered(false))
		}
		setReady(true)
	}, [appConfig])

	return <Provider store={store}>{ready && <Container />}</Provider>
}
