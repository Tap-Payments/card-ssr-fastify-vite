import valid from 'card-validator'
import creditCardType from 'credit-card-type'
import type { CardSliceState } from '../features/cardSlice'
import type { CreditCardTypeCardBrandId } from 'credit-card-type/dist/types'
import { CREDIT_CARD_NUMBER } from '../config/constant'
import { removeWhitespaces } from './string'

const overWriteCardsLength = () => {
	const cardBrandIds: CreditCardTypeCardBrandId[] = [
		'american-express',
		'diners-club',
		'discover',
		'elo',
		'hiper',
		'hipercard',
		'jcb',
		'maestro',
		'mastercard',
		'mir',
		'unionpay',
		'visa'
	]

	for (const cardBrandId of cardBrandIds) {
		const info = creditCardType.getTypeInfo(cardBrandId)
		const allowedLengths = info?.lengths?.filter((length) => length <= CREDIT_CARD_NUMBER.maxAllowedLength)
		creditCardType.updateCard(cardBrandId, {
			lengths: allowedLengths
		})
	}
}

type ReturnCardType = {
	type: CardSliceState['type'] | null
	isValid: CardSliceState['isValid']
	isPotentiallyValid: CardSliceState['isPotentiallyValid']
}
export const getCardType = (value: string): ReturnCardType => {
	overWriteCardsLength()
	const trimmedValue = removeWhitespaces(value).substring(0, CREDIT_CARD_NUMBER.maxAllowedLength)
	if (trimmedValue === '') return { type: null, isValid: false, isPotentiallyValid: false }
	const cardType = creditCardType(trimmedValue)
	const numberValidation = valid.number(trimmedValue)
	const typeValue = cardType.length > 0 ? cardType[0] : null
	return {
		type: typeValue,
		isValid: numberValidation.isValid,
		isPotentiallyValid: numberValidation.isPotentiallyValid
	}
}

interface MaskFunction {
	gaps: number[]
	lengths: number[]
}

/**
 * @param gaps - Card gaps between numbers example: [4,8,12] from cardType.
 * @param lengths - Card lengths example: [16,18,19] from cardType.
 * @returns {string} mask ex "____ ______ _____" or "____ ____ ____ ____"
 * @description -
 * The "react-input-mask" expects a string of 9s with the length MAX card number length.
 * - find largest card number length.
 * - create a mask from largest card number length.
 * - insert spaces in mask at gaps.
 * - @example
 *    const AMEX_MASK = maskStringFromCardNumber({ gaps:[4,10], lengths: [15] })
 *    // AMEX_MASK = "____ ______ _____".
 *    const VISA_MASK = maskStringFromCardNumber({ gaps:[4,8,12], lengths: [16,18.19] })
 *    // VISA_MASK = "____ ____ ____ _______".
 */
export function maskStringFromCardNumber({ gaps, lengths }: MaskFunction): string {
	// 0. if gaps or lengths are empty return default mask.
	if (gaps.length === 0 || lengths.length === 0) return CREDIT_CARD_NUMBER.defaultMask
	// 1. find largest card number length.
	const maskMaxLength = Math.max(...lengths)
	// 2. create a mask from largest card number length
	const mask = Array.from({ length: maskMaxLength }, () => '_').join('')

	// 3. insert spaces in mask at gaps
	const maskParts: string[] = []
	let position = 0
	for (const partition of gaps) {
		// check if partition is last gap
		const part = mask.slice(position, partition)
		if (part) maskParts.push(part)
		position = partition
	}
	// 4. insert the remaining of mask to maskParts
	const remainingMask = mask.slice(position)
	maskParts.push(remainingMask)

	// 5. join maskParts with spaces.
	const formattedCardNumber = maskParts.join(' ')
	return formattedCardNumber
}
