import React from 'react'
import { AnimatePresence } from 'framer-motion'

import Header from './layout/Header'
import CardHolderNameContainer from './layout/CardHolderNameContainer'
import Footer from './layout/Footer'
import AcceptedCards from './layout/footer/AcceptedCards'
import Animation from './Animation'
import styles from './container.module.css'
import { useContainerLogic } from '../hooks'
import AuthenticationIframe from './layout/AuthenticationIframe'
import FooterErrorSection from './layout/FooterErrorSection'

const Container = () => {
	const {
		inputsContainerRef,
		containerRef,
		config,
		hideSavedCardForLoading,
		supportedCards,
		hideErrorFooter,
		loadedCard,
		loading,
		hideCardFor3ds,
		isCardNumberFullWidth,
		errors,
		direction,
		language,
		pageAlignment,
		cardType,
		isInEnglish,
		authenticationURL,
		showAuthenticationIframe,
		finishAuthenticationIframe,
		is3DsActive,
		isHolderNameInEnglish,
		isTinyScreen,
		hideTranslate,
		borderRadius,
		isClickToPayEnabled,
		height3DS,
		handleFocusTop,
		handleBlurTop,
		showCardHolderName,
		starterBorderRadius,
		backgroundColor,
		boxShadow,
		version
	} = useContainerLogic()

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
	} = errors

	return (
		<>
			<div
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

					<FooterErrorSection
						hideErrorFooter={hideErrorFooter}
						isAnyError={isAnyError}
						isInEnglish={isInEnglish}
						isCreditCardError={isCreditCardError}
						isFundingSourceValid={isFundingSourceValid}
						isCountryNotSupported={isCountryNotSupported}
						isCardNumberFullWidth={isCardNumberFullWidth}
						isExpireDateError={isExpireDateError}
						isCVVError={isCVVError}
						isHolderError={isHolderError}
						notInEnglishErrorText={notInEnglishErrorText}
						creditCardErrorText={creditCardErrorText}
						isFundingSourceValidErrorMessage={isFundingSourceValidErrorMessage}
						notSupportedCountryErrorText={notSupportedCountryErrorText}
						expireDateErrorText={expireDateErrorText}
						cvvErrorText={cvvErrorText}
						holderErrorText={holderErrorText}
					/>

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
			</div>
			<AuthenticationIframe
				is3DsActive={is3DsActive}
				height3DS={height3DS}
				inputsContainerHeight={inputsContainerRef?.current?.clientHeight}
				hideCardFor3ds={hideCardFor3ds}
				showAuthenticationIframe={showAuthenticationIframe}
				finishAuthenticationIframe={finishAuthenticationIframe}
				showCardHolderName={showCardHolderName}
				starterBorderRadius={starterBorderRadius}
				borderRadius={borderRadius}
				authenticationURL={authenticationURL}
				version={version}
				backgroundColor={backgroundColor}
				boxShadow={boxShadow}
			/>
		</>
	)
}

export default React.memo(Container)
