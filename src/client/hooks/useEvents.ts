import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import API from '../api'
import HTTPClient from '../api/axios'
import { useErrors, useC2P } from '../hooks'
import { useCvv } from './useCvv'
import { useCardNumber } from './useCardNumber'
import { useExpiryDate } from './useExpiryDate'
import { isFuture, sendEventGeneric } from '../utils'
import type { CardInputs } from '@shared/types/Card'
import type { EventMessage } from '@shared/types/event'
import { Integration, Purpose, Scope } from '@shared/types'
import { getDate, resetDate, setDateValid, setDateValue } from '@features/dateSlice'
import { getCVV, resetCVV, setCvvSize, setCvvValue } from '@features/cvvSlice'
import { changeHolderNameValue, getHolderName, resetHolderNameValue } from '@features/holdernameSlice'
import { getExactCardValue, resetCard, setMode, setTypeSavedCard } from '@features/cardSlice'
import {
	setAuthenticationURL,
	setShowAuthenticationIframe,
	resetAuthentication,
	setFinishAuthenticationIframe,
	setIs3DsActive,
	getAuthentication
} from '@features/authenticationSlice'
import {
	getConfig,
	setConfigPaymentOption,
	setTheme,
	setPublicKey,
	setHideSavedCardForLoading,
	setHideErrorFooter,
	setIP,
	setClickToPay,
	setScope
} from '@features/configSlice'
import {
	setGlobalMode,
	setLoadedCard,
	setSaveCardForLater,
	getGlobalState,
	setLoading,
	setHideCardFor3ds
} from '@features/globalSlice'

// eslint-disable-next-line
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
export const useEvents = () => {
	const { encrypt, loadScr } = useC2P()
	const { isAllInputsValid } = useErrors()
	const cardValue = useSelector(getExactCardValue)
	const { globalMode, loadedCard, saveCardForLater } = useSelector(getGlobalState)
	const { value: dateValue } = useSelector(getDate)
	const { value: cvvValue } = useSelector(getCVV)
	const { value: nameValue } = useSelector(getHolderName)
	const { authenticationURL } = useSelector(getAuthentication)
	const {
		config: configProps,
		encryptionKey,
		cards,
		refererUrl,
		authentication,
		scope,
		powered,
		ip,
		features,
		clickToPay
	} = useSelector(getConfig)
	const { onChangeCardNumber } = useCardNumber()
	const { onChangeExpiryDate } = useExpiryDate()
	const { onChangeCvv } = useCvv()

	const dispatch = useDispatch()

	const fillCardInputs = React.useCallback((cardInputs: CardInputs) => {
		if (cardInputs.cardNumber) onChangeCardNumber(cardInputs.cardNumber)
		if (cardInputs.expiryDate) onChangeExpiryDate(cardInputs.expiryDate)
		if (cardInputs.cvv) onChangeCvv(cardInputs.cvv)

		const isHolderNameEditable =
			configProps.paymentOptions?.cardNameEditable === true ||
			(configProps.paymentOptions?.preLoadCardName?.length || 0) < 4
		if (cardInputs.cardHolderName && isHolderNameEditable) {
			dispatch(changeHolderNameValue(cardInputs.cardHolderName.toUpperCase()))
		}
	}, [])

	const handleClearInputs = React.useCallback(() => {
		dispatch(resetCard())
		dispatch(resetDate())
		dispatch(resetCVV())
		dispatch(resetHolderNameValue())
		dispatch(setGlobalMode('createToken'))
		dispatch(setSaveCardForLater(!!features?.customerCards?.autoSaveCard))
		dispatch(setLoadedCard(null))
		dispatch(setHideSavedCardForLoading(false))
	}, [])

	const loadCardInputs = React.useCallback((cardId: string) => {
		dispatch(setGlobalMode('CreateTokenSavedCard'))
		dispatch(setMode('right'))
		dispatch(setCvvValue(''))
		if (!cards) return
		const card = cards.find((item) => item.id === cardId)
		if (card) {
			const { brand, expiry } = card
			const isAmex = brand === 'AMERICAN_EXPRESS'
			dispatch(setLoadedCard(card))
			dispatch(setTypeSavedCard(brand))
			dispatch(setCvvSize({ size: isAmex ? 4 : 3 }))
			const expireMonth = Number(expiry.month) < 10 ? `0${expiry.month}` : expiry.month
			dispatch(setDateValue(`${expireMonth}/${expiry.year}`))
			const { isDateInTheFuture } = isFuture(`${expireMonth}/${expiry.year}`)
			if (isDateInTheFuture) {
				dispatch(setDateValid(true))
				return
			}
			dispatch(setDateValid(false))
		} else {
			handleClearInputs()
		}
	}, [])

	const startLoading = React.useCallback((delay = 500) => {
		dispatch(setLoading(true))
		setTimeout(() => {
			sendEventGeneric(refererUrl, { event: 'loadingIframe', data: true })
		}, delay)
	}, [])

	const eventListener = async (e: MessageEvent) => {
		const { data, event, action } = e.data as EventMessage<any>
		const isSubmitEvent = event === 'tokenize' || event === 'saveCard'
		const isSamePK = data?.publicKey === configProps.publicKey
		const customerId = configProps.paymentOptions?.customer ?? ''
		const shouldCreateToken = isAllInputsValid && isSubmitEvent && isSamePK
		const isScopeToken = scope === Scope.TOKEN
		const isClick2payActive =
			clickToPay?.enabled && clickToPay?.fired && configProps.integration === Integration.CHECKOUT

		try {
			if (shouldCreateToken) {
				if (isClick2payActive) {
					const isLoaded = await loadScr(clickToPay?.url).catch((error) => {
						sendEventGeneric(e.origin, {
							event: 'click2Pay',
							data: {
								isLoaded: false,
								error
							}
						})
						return false
					})

					if (!isLoaded) return

					const encryptionResult = await encrypt({
						cardNumber: cardValue,
						cvv: cvvValue,
						date: dateValue
					})
					sendEventGeneric(e.origin, {
						event: 'click2Pay',
						data: {
							...encryptionResult
						}
					})
					return
				}
				const isSaveCardSwitchVisible = configProps.paymentOptions?.saveCardOption !== 'none'
				const isSavePurpose = authentication?.authentication?.purpose === Purpose.SAVE_TOKEN
				if (isSaveCardSwitchVisible && isSavePurpose && saveCardForLater === false) {
					// eslint-disable-next-line
					throw { message: 'The customer has to agree to save the card', code: 400 }
				}
				let tokenReceived: any = null
				const startTokenization = async (payload: any) => {
					startLoading()
					await sleep(1000)
					const tokenReceived = await payload()
					return tokenReceived
				}

				if (globalMode === 'createToken') {
					tokenReceived = await startTokenization(() =>
						API.tokenService.createToken({
							cardValue,
							dateValue,
							cvvValue,
							nameValue,
							configProps,
							encryptionKey,
							refererUrl,
							authentication,
							scope,
							saveCard: saveCardForLater,
							isSaveCardSwitchVisible,
							ip
						})
					)
				} else if (loadedCard) {
					tokenReceived = await startTokenization(() =>
						API.tokenService.createTokenSavedCard({
							customer: customerId,
							loadedCard,
							configProps,
							cvvValue,
							encryptionKey,
							refererUrl,
							authentication,
							ip
						})
					)
				}
				if (tokenReceived) {
					isScopeToken && handleClearInputs()
					if (event === 'saveCard') {
						const request_verify = {
							source: { id: tokenReceived.id },
							redirect: { url: window.location.href },
							save_card: true,
							threeDSecure: true,
							customer: {
								locale: configProps.paymentOptions?.locale ?? 'en',
								id: customerId,
								first_name: nameValue ?? ''
							},
							currency:
								typeof configProps?.paymentOptions?.currencyCode === 'string'
									? configProps?.paymentOptions?.currencyCode
									: (configProps?.paymentOptions?.currencyCode?.[0] ?? '')
						}

						const verifyCard = await API.cardService.createCardVerify({
							configProps,
							request: request_verify,
							refererUrl
						})

						if (verifyCard.status === 'INITIATED') {
							localStorage.setItem('verifyCardId', verifyCard.id)
							sendEventGeneric(refererUrl, { event: '3dsRedirect', data: { threeDsRedirect: true } })
							window.location.replace(verifyCard.transaction.url)
							sendEventGeneric(refererUrl, { event: 'loadingIframe', data: true })
							dispatch(setLoading(true))
							dispatch(setHideCardFor3ds(true))
						} else {
							sendEventGeneric(refererUrl, { event: '3dsFail', data: { threeDsFail: verifyCard.response } })
							sendEventGeneric(refererUrl, { event: 'loadingIframe', data: false })
							dispatch(setLoading(false))
						}
						return
					} else if (event === 'tokenize' && [Scope.AUTHENTICATED_TOKEN].includes(scope)) {
						const redirectObject = await API.authenticationService.createAuthentication({
							publicKey: configProps.publicKey,
							authentication,
							tokenResponse: tokenReceived,
							ip,
							saveCard: saveCardForLater
						})
						const authUrl = redirectObject.authentication.url
						if (redirectObject.status === 'INITIATED' && authUrl) {
							dispatch(setAuthenticationURL(authUrl))
						} else {
							sendEventGeneric(refererUrl, {
								event: 'authentication',
								data: { authentication: redirectObject }
							})
							sendEventGeneric(refererUrl, { event: 'loadingIframe', data: false })
							dispatch(setLoading(false))
						}
					} else {
						const redirectUrl = window.location.href
						sendEventGeneric(refererUrl, { event: 'loadingIframe', data: false })
						dispatch(setLoading(false))
						sendEventGeneric(e.origin, { event: 'token', data: { token: tokenReceived, redirectUrl } })
						sendEventGeneric(e.origin, { event: 'redirectUrl', data: { redirectUrl } })
						dispatch(setHideSavedCardForLoading(false))
					}
				}
			} else {
				if (event === 'tokenize') {
					dispatch(setHideSavedCardForLoading(false))
				}
			}

			if (event === 'loadAuthentication' && data.authenticationUrl) {
				sendEventGeneric(refererUrl, {
					event: '3dsRedirect',
					data: { threeDsRedirect: false }
				})
				const { authenticationUrl } = data
				const authenticationId = new URLSearchParams(authenticationUrl.split('?')[1]).get('auth_payer') as string
				const authentication = await API.authenticationService.getAuthentication({
					authId: authenticationId,
					publicKey: configProps.publicKey
				})
				handleClearInputs()
				sendEventGeneric(refererUrl, {
					event: 'authentication',
					data: { authentication }
				})
				sendEventGeneric(refererUrl, { event: 'loadingIframe', data: false })
				dispatch(setLoading(false))
				dispatch(resetAuthentication())
			}
			if (event === 'cancelAuthentication') {
				dispatch(setLoading(false))
				sendEventGeneric(refererUrl, { event: 'loadingIframe', data: false })
				dispatch(setHideSavedCardForLoading(false))
			}

			if (event === 'loadSavedCard') {
				const { cardId } = data
				loadCardInputs(cardId)
			}
			if (event === 'hideSavedCardOption') {
				dispatch(setHideSavedCardForLoading(data.hide))
			}

			if (event === 'hideErrorFooter') {
				dispatch(setHideErrorFooter(data.hide))
			}
			if (event === 'updatePaymentOption') {
				if (data?.scope) {
					return dispatch(setScope(data?.scope))
				}
				if (data?.clickToPay) {
					return dispatch(setClickToPay(data?.clickToPay))
				}
				const { paymentOptions } = data as {
					publicKey: string
					paymentOptions: any
				}
				return dispatch(setConfigPaymentOption(paymentOptions as any))
			}
			if (event === 'reset') {
				handleClearInputs()
			}
			if (event === 'updateThemeMode') {
				dispatch(setTheme(data.theme))
			}
			if (event === 'updatePublicKey') {
				dispatch(setPublicKey(data.newPublicKey))
			}
			if (event === 'fillCardInputs') {
				fillCardInputs(data.cardInputs as CardInputs)
			}
			if (event === 'sendIP') {
				dispatch(setIP(data.ip))
			}
			if (event === 'sendHeaders') {
				if (data.headers) {
					HTTPClient.defaults.headers.common = {
						...HTTPClient.defaults.headers.common,
						...data.headers
					}
				}
			}
			if (action === '3dsIframe:onReady') {
				sendEventGeneric(refererUrl, {
					event: 'on3dsRedirect',
					data: {
						threeDsUrl: authenticationURL,
						redirectUrl: window.location.origin,
						keyword: 'auth_payer',
						powered
					}
				})
				sendEventGeneric(refererUrl, {
					event: '3dsRedirect',
					data: { threeDsRedirect: true }
				})
				if (configProps.integration === Integration.WEBVIEW) {
					dispatch(setAuthenticationURL(undefined))
					return
				}
				dispatch(setShowAuthenticationIframe(true))
				setTimeout(() => {
					dispatch(setIs3DsActive(true))
				}, 500)
				setTimeout(() => {
					sendEventGeneric(refererUrl, { event: 'loadingIframe', data: false })
					dispatch(setLoading(false))
				}, 1200)
			}
			if (action === '3dsIframe:onFinish' && data) {
				dispatch(setLoading(true))
				sendEventGeneric(refererUrl, { event: 'loadingIframe', data: true })
				dispatch(setFinishAuthenticationIframe(true))
				sendEventGeneric(refererUrl, { event: 'on3dsFinish', data: true })

				setTimeout(() => {
					dispatch(setIs3DsActive(false))
				}, 200)

				setTimeout(() => {
					dispatch(setFinishAuthenticationIframe(false))
					dispatch(setShowAuthenticationIframe(false))
					sendEventGeneric(refererUrl, {
						event: '3dsRedirect',
						data: { threeDsRedirect: false }
					})
				}, 1000)

				setTimeout(async () => {
					const authenticationId = new URLSearchParams(data.split('?')[1]).get('auth_payer')
					const authentication = await API.authenticationService.getAuthentication({
						authId: authenticationId!,
						publicKey: configProps.publicKey
					})
					handleClearInputs()
					sendEventGeneric(refererUrl, {
						event: 'authentication',
						data: { authentication }
					})
					sendEventGeneric(refererUrl, { event: 'loadingIframe', data: false })
					dispatch(setLoading(false))
					dispatch(resetAuthentication())
				}, 2000)
			}
		} catch (error) {
			dispatch(setLoading(false))
			sendEventGeneric(refererUrl, { event: 'loadingIframe', data: false })
			sendEventGeneric(refererUrl, { event: 'error', data: error })
			dispatch(setHideSavedCardForLoading(false))
		}
	}
	useEffect(() => {
		window.addEventListener('message', eventListener, false)
		return () => {
			window.removeEventListener('message', eventListener)
		}
	}, [
		nameValue,
		cardValue,
		cvvValue,
		dateValue,
		isAllInputsValid,
		authenticationURL,
		saveCardForLater,
		authentication?.currency,
		clickToPay.fired
	])
}
