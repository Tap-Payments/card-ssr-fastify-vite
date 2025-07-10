import React, { type ElementRef, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useSelector } from 'react-redux'

import Header from './layout/Header'
import CardHolderNameContainer from './layout/CardHolderNameContainer'
import Footer from './layout/Footer'
import AcceptedCards from './layout/footer/AcceptedCards'
import {
	useErrors,
	useEvents,
	useLocale,
	useTheme,
	useValidatePost,
	useDimensionEvent,
	useHandleRedirects
} from '../hooks'
import { sendEventGeneric } from '@utils'
import { getGlobalState } from '@features/globalSlice'
import { getCard } from '@features/cardSlice'
import { getConfig } from '@features/configSlice'
import { getAuthentication } from '@features/authenticationSlice'
import Animation from './Animation'
import { Borders } from '../utils/layout'
import { Edges } from '@shared/types'
import packageJson from '../../../package.json'
import { getHolderName } from '../features/holdernameSlice'
import FirstTruthyOf from './shared/FirstTruthyOf'
import { THREE_DS_HEIGHT } from '@shared/config/constant'

import styles from './container.module.css'

const Container = () => {
	const inputsContainerRef = useRef<ElementRef<'section'>>(null)
	const {
		themeMode,
		refererUrl,
		config,
		hideSavedCardForLoading,
		supportedCards,
		hideErrorFooter,
		authentication,
		clickToPay
	} = useSelector(getConfig)
	const { loadedCard, loading, hideCardFor3ds } = useSelector(getGlobalState)
	const { mode } = useSelector(getCard)
	const isCardNumberFullWidth = mode === 'left'
	const {
		isHeaderValid,
		isAnyError,
		isCreditCardError,
		isExpireDateError,
		isCVVError,
		isHolderError,
		isShowCollectHolderName,
		notInEnglishErrorText,
		creditCardErrorText,
		expireDateErrorText,
		cvvErrorText,
		holderErrorText,
		isFundingSourceValid,
		isFundingSourceValidErrorMessage,
		isCardHolderValid,
		isCountryNotSupported,
		notSupportedCountryErrorText
	} = useErrors()

	const { direction, language, pageAlignment } = useLocale()
	useEvents()
	useHandleRedirects()
	useValidatePost()
	useDimensionEvent()

	const { type: cardType, isInEnglish } = useSelector(getCard)
	const { authenticationURL, showAuthenticationIframe, finishAuthenticationIframe, is3DsActive } =
		useSelector(getAuthentication)

	const { isInEnglish: isHolderNameInEnglish } = useSelector(getHolderName)

	const { theme, isDark, getColorProperty } = useTheme()
	const [isTinyScreen, setIsTinyScreen] = useState(false)
	const [hideTranslate, setHideTranslate] = useState(false)
	const [borderRadius, setBorderRadius] = useState(
		config.paymentOptions?.edges
			? Borders[config.paymentOptions?.edges]
			: theme.inlineCard.commonAttributes.cornerRadius
	)
	const isClickToPayEnabled = clickToPay?.enabled === true

	const containerRef = useRef<ElementRef<'form'>>(null)

	const height3DS = useMemo(() => authentication?.height3DS || THREE_DS_HEIGHT, [authentication])

	const { offsetWidth, offsetHeight, radius } = theme.inlineCard.commonAttributes.shadow
	let isFocused: boolean = false
	const handleFocusTop = React.useCallback(() => {
		if (isFocused === true) return
		isFocused = true
		sendEventGeneric(refererUrl, { event: 'focused', data: { focused: true } })
	}, [])
	const handleBlurTop = React.useCallback(() => {
		isFocused = false
	}, [onmousedown])

	const showCardHolderName = isHeaderValid && !loadedCard && !isAnyError && isShowCollectHolderName

	const defaultCardBorderRadius = theme.inlineCard.commonAttributes.cornerRadius
	const borderFromConfig = config.paymentOptions?.edges
	const starterBorderRadius = borderFromConfig ? Borders[borderFromConfig] : defaultCardBorderRadius
	useEffect(() => {
		let calculatedCardBorderRadius = starterBorderRadius

		const isCardFooterShown = isAnyError || showAuthenticationIframe || showCardHolderName

		if (borderFromConfig === Edges.CIRCULAR && isCardFooterShown) {
			calculatedCardBorderRadius = defaultCardBorderRadius
		}
		const time = showAuthenticationIframe ? 600 : 0
		const updateBorderRadiusTimer = setTimeout(() => {
			setBorderRadius(calculatedCardBorderRadius)
		}, time)
		return () => clearTimeout(updateBorderRadiusTimer)
	}, [showCardHolderName, isAnyError, showAuthenticationIframe, finishAuthenticationIframe])

	useEffect(() => {
		sendEventGeneric(refererUrl, {
			event: 'borderRadius',
			data: {
				borderRadius: finishAuthenticationIframe && !showCardHolderName ? starterBorderRadius : borderRadius
			}
		})
	}, [borderRadius, showCardHolderName])
	useEffect(() => {
		sendEventGeneric(refererUrl, { event: 'onCardReady', data: { ready: true } })
	}, [refererUrl])

	useEffect(() => {
		document.body.style.setProperty(
			'--placeholder-color',
			getColorProperty(theme.inlineCard.textFields.placeHolderColor)
		)
		document.body.style.setProperty('overflow', 'hidden')
	}, [theme])

	useEffect(() => {
		const handleResize = () => {
			setIsTinyScreen((containerRef.current?.clientWidth || 0) < 320)
			setHideTranslate((containerRef.current?.clientWidth || 0) < 250)
		}
		handleResize()
		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [])

	const backgroundColor = getColorProperty(theme.inlineCard.commonAttributes.backgroundColor)
	useEffect(() => {
		const black = 'rgba(0, 0, 0, 0.1)'
		const white = 'rgba(255, 255, 255, 0.1)'

		const backgroundColor = isDark ? black : white
		sendEventGeneric(refererUrl, {
			event: 'backgroundColor',
			data: {
				backgroundColor
			}
		})
	}, [themeMode])
	const version = `iframe_${packageJson.version}`
	// const sdkVersion = `sdk_${packageJson.dependencies['@tap-payments/card-web']}`
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		e.stopPropagation()
	}
	const boxShadow = `${offsetHeight} ${offsetWidth} ${radius}px rgba(0, 0, 0, 0.15)`
	return (
		<>
			<form
				style={{
					position: 'absolute',
					width: '100%',
					pointerEvents: loading ? 'none' : 'auto',
					opacity: hideCardFor3ds || showAuthenticationIframe ? 0 : 1,
					transition: 'opacity 0.5s ease-in',
					zIndex: showAuthenticationIframe ? 1 : 2
				}}
				onFocusCapture={handleFocusTop}
				onMouseDown={handleBlurTop}
				id='card-main-container'
				data-src='jscard-node-mw'
				ref={containerRef}
				data-version={version}
				// data-version-sdk={sdkVersion}
				onSubmit={handleSubmit}
			>
				<section
					ref={inputsContainerRef}
					id='card-inputs-container'
					className={styles['container']}
					data-src='jscard-node-mw'
					data-dir={config.paymentOptions?.direction ?? direction}
					data-lang={language}
					data-text-align={pageAlignment}
					dir={config.paymentOptions?.direction ?? direction}
					lang={language}
					style={{
						backgroundColor,
						boxShadow,
						textAlign: pageAlignment,
						borderRadius,
						overflow: 'hidden',
						transition: 'all 0s ease-in-out',
						...(isTinyScreen && {
							marginLeft: 0,
							marginRight: 0
						})
					}}
				>
					<AnimatePresence initial={false} key='card-animate-presence-1'>
						<Animation key={'animation-0'} duration={0.5}>
							<Header validClass={isHeaderValid} tinyScreen={isTinyScreen} hideTranslate={hideTranslate} />
						</Animation>
					</AnimatePresence>

					<AnimatePresence initial={false} key='card-animate-presence-2'>
						{!hideErrorFooter &&
							isAnyError &&
							(!isInEnglish ? (
								<Animation key={'animation-6'} duration={0.5} id='animation-1-6'>
									<Footer isError={true} errorText={notInEnglishErrorText} style={{ height: 42 }} />
								</Animation>
							) : (
								<FirstTruthyOf>
									{isCreditCardError && (
										<Animation key={'animation-1'} duration={0.5} id='animation-1-0'>
											<Footer isError={true} errorText={creditCardErrorText} style={{ height: 42 }} />
										</Animation>
									)}
									{!isFundingSourceValid && (
										<Animation key={'animation-5'} duration={0.5} id='animation-1-4'>
											<Footer isError={true} errorText={isFundingSourceValidErrorMessage} style={{ height: 42 }} />
										</Animation>
									)}
									{isCountryNotSupported && (
										<Animation key={'animation-6'} duration={0.5} id='animation-1-6'>
											<Footer isError={true} errorText={notSupportedCountryErrorText} style={{ height: 42 }} />
										</Animation>
									)}
								</FirstTruthyOf>
							))}
					</AnimatePresence>

					<AnimatePresence initial={false} key='card-animate-presence-3'>
						{isInEnglish && !(isCardNumberFullWidth || hideErrorFooter) && isAnyError && (
							<>
								{isExpireDateError && (
									<Animation key={'animation-2'} duration={0.5} id='animation-1-1'>
										<Footer isError={true} errorText={expireDateErrorText} style={{ height: 42 }} />
									</Animation>
								)}
								{isCVVError && (
									<Animation key={'animation-3'} duration={0.5} id='animation-1-2'>
										<Footer isError={true} errorText={cvvErrorText} style={{ height: 42 }} />
									</Animation>
								)}
								{isHolderError && (
									<Animation key={'animation-4'} duration={0.5} id='animation-1-3'>
										<Footer isError={true} errorText={holderErrorText} style={{ height: 42 }} />
									</Animation>
								)}
							</>
						)}
					</AnimatePresence>

					<AnimatePresence initial={false} key='card-animate-presence-4'>
						{showCardHolderName && (
							<>
								<Animation key={'animation-6'} duration={0.5} id='animation-1'>
									<CardHolderNameContainer tinyScreen={isTinyScreen} />
								</Animation>
								{!isHolderNameInEnglish && (
									<Animation key='animation-1' duration={0.5} id='animation-1-1'>
										<Footer isError={true} errorText={notInEnglishErrorText} style={{ height: 42 }} />
									</Animation>
								)}
							</>
						)}
					</AnimatePresence>
				</section>
				<section id='card-footer' data-src='jscard-node-mw'>
					<AnimatePresence initial={false} key='card-animate-presence-5'>
						{!isClickToPayEnabled &&
							(isShowCollectHolderName ? isCardHolderValid : true) &&
							isHeaderValid &&
							!loadedCard &&
							!isAnyError &&
							!hideSavedCardForLoading && (
								<>
									<Animation key={'animation-7'} duration={0.5} id='animation-2'>
										<Footer
											isError={false}
											scStyle={{ height: 43, paddingTop: 2, paddingBottom: 9 }}
											tinyScreen={isTinyScreen}
										/>
									</Animation>
								</>
							)}

						{!isClickToPayEnabled &&
							!cardType &&
							!loadedCard &&
							supportedCards?.length &&
							(config.paymentOptions?.displayPaymentBrands === true ||
								config.paymentOptions?.displayPaymentBrands === undefined) && (
								<Animation key={'animation-9'} duration={0.5} id='animation-3'>
									<AcceptedCards
										dir={direction}
										lang={language}
										style={{ height: 31, padding: isTinyScreen ? 0 : 8 }}
									/>
								</Animation>
							)}
					</AnimatePresence>
				</section>
			</form>
			<div
				data-src='jscard-node-mw'
				data-testid='tap-authentication'
				style={{
					margin: 8,
					backgroundColor,
					height: is3DsActive ? height3DS - 16 : inputsContainerRef?.current?.clientHeight,
					opacity: showAuthenticationIframe || finishAuthenticationIframe ? 1 : 0,
					boxShadow,
					borderRadius: finishAuthenticationIframe && !showCardHolderName ? starterBorderRadius : borderRadius,
					width: 'calc(100% - 16px)',
					position: 'absolute',
					overflow: 'hidden',
					transition: finishAuthenticationIframe
						? 'all 0.5s ease-in-out, border-radius 0.5s ease-in-out'
						: 'all 0.6s ease-in-out',
					zIndex: showAuthenticationIframe ? 2 : 1
				}}
			>
				<iframe
					id='tap-card-iframe-authentication'
					data-src='jscard-node-mw'
					name='tapFrame'
					title='Secure payment input'
					width='100%'
					height='100%'
					allowFullScreen={true}
					referrerPolicy='origin'
					data-version={version}
					// data-version-sdk={sdkVersion}
					frameBorder='0'
					style={{
						border: 'none',
						opacity: showAuthenticationIframe && !finishAuthenticationIframe ? 1 : 0,
						padding: '0',
						overflow: 'block',
						transition:
							showAuthenticationIframe && !finishAuthenticationIframe
								? 'opacity 0s ease-out 1.2s, border-radius 0.5s ease-in-out'
								: '',
						borderRadius: finishAuthenticationIframe && !showCardHolderName ? starterBorderRadius : borderRadius
					}}
					src={authenticationURL}
				/>
			</div>
		</>
	)
}

export default React.memo(Container)
