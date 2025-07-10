import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { getConfig } from '@features/configSlice'
import { getCard } from '@features/cardSlice'
import { getDate } from '@features/dateSlice'
import { getCVV } from '@features/cvvSlice'
import { getHolderName } from '@features/holdernameSlice'
import { CardBrands } from '@shared/types/paymentOption'
import { getGlobalState } from '../features/globalSlice'
import { useTranslation } from 'react-i18next'
import { CardFundingSource, Integration } from '@shared/types'
//

const fundingSourceToTranslationKey = Object.freeze({
	[CardFundingSource.ALL]: '',
	[CardFundingSource.CREDIT]: 'TapCardInputKit.credit',
	[CardFundingSource.DEBIT]: 'TapCardInputKit.debit'
})

const capitalize = (val: string) => val.charAt(0).toUpperCase() + val.slice(1)

/**
 * @description - Hook to get all errors from all inputs.
 * @returns {object}
 * - isHeaderValid - Hide <AcceptedCards /> component if all fields isAllInputsValid=== true.
 * - isAllInputsValid - Hide <SubmitButton /> component if all fields isAllInputsValid=== true.
 * - isAnyError - if any input is invalid, then show error message.
 * - isCreditCardError - make sure creditCard Number is collectable and isValid.
 * - isExpireDateError - make sure expireDate is collectable and isValid.
 * - isCVVError - make sure cvv is collectable and isValid.
 * - isCardHolderValid - make sure cardHolder is collectable and isValid.
 * - isHolderError - make sure cardHolder is collectable and isValid.
 * - isShowCollectHolderName - if merchant set collectHolderName=false, then hide <Main /> component, which contains holder name input, default value is true if not provided.
 * - creditCardErrorText - error message from creditCard input.
 * - expireDateErrorText - error message from expireDate input.
 * - cvvErrorText - error message from cvv input.
 * - holderErrorText - error message from holderName input.
 * - isInCardSupported - make sure card entered is in supported cards array config array.
 */
export const useErrors = () => {
	const { globalMode } = useSelector(getGlobalState)
	const { config, supportedCards, clickToPaySupportedCards, clickToPay, disabledCards, cardCVV, savedCardCVV } =
		useSelector(getConfig)
	const { t } = useTranslation()

	const {
		type: cardType,
		isValid: isCreditCardValid,
		isPotentiallyValid: isCreditCardPotentiallyValid,
		isUserDoneTyping: isCreditCardCompleteTyping,
		BIN,
		isInEnglish
	} = useSelector(getCard)

	const { isValid: isExpireDateValid, isUserDoneTyping: isExpireDateCompleteTyping } = useSelector(getDate)

	const creditCardErrorText = t('Hints.Error.wrongCardNumber')
	const holderErrorText = t('Hints.Warning.missingName')
	const expireDateErrorText = t('Hints.Warning.missingExpiryCVV')
	const notInEnglishErrorText = t('Hints.Error.notEnglishInput')
	const notSupportedCountryErrorText = useMemo(
		() => t('Hints.Error.wrongCountry').replace('%@', BIN?.country || ''),
		[t, BIN?.country]
	)

	const { isValid: isCVVValid, isUserDoneTyping: isCVVCompleteTyping, errorText: cvvErrorText } = useSelector(getCVV)

	const { isValid: isHolderValid, isUserDoneTyping: isHolderCompleteTyping } = useSelector(getHolderName)
	const cardFundingSource =
		config.paymentOptions?.cardFundingSource !== undefined ? config.paymentOptions?.cardFundingSource : 'all'

	const isFundingSourceValid =
		BIN === null || (BIN !== null && cardFundingSource === 'all') || BIN.card_type === cardFundingSource.toUpperCase()

	const isFundingSourceValidErrorMessage = useMemo(() => {
		if (!isFundingSourceValid && BIN !== null) {
			const cardTypeLowered = BIN.card_type?.toLowerCase() as CardFundingSource

			const fsTranslationKey =
				cardTypeLowered in fundingSourceToTranslationKey
					? fundingSourceToTranslationKey[cardTypeLowered]
					: fundingSourceToTranslationKey[CardFundingSource.ALL]

			const errorTranslated = t('Hints.Error.wrongFundSource').replace('%@', t(fsTranslationKey))
			return capitalize(errorTranslated.trim())
		}
		return null
	}, [isFundingSourceValid, BIN, creditCardErrorText])

	const supportedCountries = useMemo(() => {
		try {
			const parsedConfig = JSON.parse(config.config)
			return (parsedConfig?.acceptance?.supportedCountries as string[]) || null
		} catch (error) {
			return null
		}
	}, [config.config])

	const isCountryNotSupported = useMemo<boolean>(() => {
		if (!BIN?.country || !supportedCountries?.length) return false
		return !supportedCountries.includes(BIN.country)
	}, [BIN?.country, config])

	const isShowCollectHolderName = !!config.paymentOptions?.collectHolderName

	const isCardHolderValid = isShowCollectHolderName && isHolderValid

	// make sure card entered is in supported cards array config array.
	const currentCardType = cardType?.type.toUpperCase().replace('-', '_') as unknown as CardBrands
	const currentSupportedCards = clickToPay?.enabled ? clickToPaySupportedCards : supportedCards
	const isInCardSupported = currentSupportedCards.find(
		(card) => card.name === currentCardType || (BIN !== null && card.name === BIN.card_scheme)
	)
		? true
		: false

	const isInCardDisabled = disabledCards.find(
		(card) => card.name === currentCardType || (BIN !== null && card.name === BIN.card_scheme)
	)
		? true
		: false

	const isCardSupported =
		isInCardSupported || (config.integration === Integration.CHECKOUT && !clickToPay?.enabled && isInCardDisabled)
	const isCreditCardError =
		(isCreditCardCompleteTyping && !isCreditCardValid && !isCreditCardPotentiallyValid) ||
		(isCreditCardCompleteTyping && !isCardSupported)

	const isExpireDateError = isExpireDateCompleteTyping && !isExpireDateValid && !isCreditCardError
	const isCVVError = !isExpireDateError && isCVVCompleteTyping && !isCVVValid
	const isHolderError = !isCVVError && isHolderCompleteTyping && !isHolderValid

	const isHeaderValid = isCreditCardValid && isExpireDateValid && (!cardCVV || isCVVValid) && !isCreditCardError

	const isAnyError =
		!isFundingSourceValid ||
		isCreditCardError ||
		isExpireDateError ||
		isCVVError ||
		isHolderError ||
		!isInEnglish ||
		isCountryNotSupported

	const isAllInputsValid =
		globalMode === 'createToken'
			? isCreditCardValid &&
				isExpireDateValid &&
				(!cardCVV || isCVVValid) &&
				isInCardSupported &&
				(isCardHolderValid || isShowCollectHolderName === false) &&
				isFundingSourceValid
			: (!savedCardCVV || isCVVValid) && isExpireDateValid

	return {
		isHeaderValid,
		isAllInputsValid,
		isAnyError,
		isCreditCardError,
		isExpireDateError,
		isCVVError,
		isCardHolderValid,
		isHolderError,
		isShowCollectHolderName,
		isFundingSourceValid,
		isFundingSourceValidErrorMessage,
		creditCardErrorText,
		expireDateErrorText,
		notInEnglishErrorText,
		cvvErrorText,
		holderErrorText,
		isInCardSupported,
		isCVVCompleteTyping,
		isExpireDateCompleteTyping,
		isCreditCardCompleteTyping,
		isHolderCompleteTyping,
		isCountryNotSupported,
		notSupportedCountryErrorText
	}
}
