import { CURRENCIES, PAYMENT_METHODS } from '@shared/types/paymentOption'

// FIXME: image url will be from CDN not static.
const FLAG_BASE_URL = `../../images/flags`
const PAYMENT_BASE_URL = `../../images/payment`

export function getFlagIcon(currency: CURRENCIES): string {
	if (!currency) return ''

	return `${FLAG_BASE_URL}/${currency}.svg`
}

export function getPaymentIcon(method: PAYMENT_METHODS): string {
	if (!method) return ''

	// if method not in PAYMENT_METHOD enum, return empty string
	if (!Object.values(PAYMENT_METHODS).includes(method)) return `${PAYMENT_BASE_URL}/cheque.svg`

	switch (method) {
		case 'NAPS':
			return `${PAYMENT_BASE_URL}/naps.png`
		case 'AMERICAN_EXPRESS':
			return `${PAYMENT_BASE_URL}/amex.svg`
		case 'CAREEM_PAY':
			return `${PAYMENT_BASE_URL}/careem.svg`
		case 'TABBY_INSTALLMENT':
			return `${PAYMENT_BASE_URL}/tabby.svg`
		default:
			return `${PAYMENT_BASE_URL}/${method.split('_').join('').toLocaleLowerCase()}.svg`
	}
}
