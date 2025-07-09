import type { PaymentMethod } from '@tap-payments/acceptance-sdk'
import type { RootState } from '../app/store'
import { CardBrands, type CURRENCIES, type PAYMENT_METHODS, type SupportedCards } from '../types/paymentOption'
import { isSupportedCurrency } from './paymentMethod/isSupportedCurrency'

type paymentMethodsName = keyof typeof PAYMENT_METHODS

export function filterAllowedCardMethods(paymentMethods: RootState['config']['paymentOptions']) {
	return paymentMethods.filter(({ payment_type }) => payment_type.toLocaleUpperCase() === 'CARD')
}

export function filterPaymentMethodsByNames<T = PaymentMethod>({
	paymentMethods,
	names
}: {
	paymentMethods: RootState['config']['paymentOptions']
	names: paymentMethodsName[]
}): T[] {
	return paymentMethods.filter(({ name }) => names.includes(name as any)) as T[]
}

export function getPaymentMethodByName({
	paymentMethods,
	name
}: {
	paymentMethods: RootState['config']['paymentOptions']
	name: paymentMethodsName
}) {
	return paymentMethods.find((method) => method.name === name)
}

export function supportedCardsByPaymentMethod({
	paymentMethods,
	supportedCardBrands
}: {
	paymentMethods: RootState['config']['paymentOptions']
	supportedCardBrands: PaymentMethod['supported_card_brands']
}) {
	return filterPaymentMethodsByNames<SupportedCards>({
		paymentMethods,
		names: supportedCardBrands as paymentMethodsName[]
	})
}

export function getClickToPaySupportedCards({
	paymentMethods
}: {
	paymentMethods: RootState['config']['paymentOptions']
}): RootState['config']['allCards'] {
	const clickToPayPaymentMethod = getPaymentMethodByName({
		paymentMethods,
		name: 'CLICK2PAY'
	}) as unknown as SupportedCards
	if (!clickToPayPaymentMethod) {
		return [] as unknown as RootState['config']['allCards']
	}

	const clickToPaySupportedCards = supportedCardsByPaymentMethod({
		paymentMethods,
		supportedCardBrands: clickToPayPaymentMethod?.supported_card_brands || []
	})

	const supportedCardsWithC2P = [clickToPayPaymentMethod, ...clickToPaySupportedCards].map((card) => ({
		...card,
		isDisabled: false
	}))

	return supportedCardsWithC2P
}

export function getAcceptedCards({
	allCards,
	currencyCode
}: {
	allCards: RootState['config']['allCards']
	currencyCode: string | string[]
}) {
	const acceptedCards = allCards
		.filter(
			(item) =>
				item.payment_type === 'card' &&
				isSupportedCurrency({
					currencyCode,
					supportedCurrencies: item.supported_currencies as unknown as CURRENCIES[]
				})
		)
		.sort((a, b) => (a.order_by > b.order_by ? 1 : -1)) as unknown as Array<SupportedCards>

	return acceptedCards
}

export function getNotAcceptedCards({
	allCards,
	currencyCode
}: {
	allCards: RootState['config']['allCards']
	currencyCode: string | string[]
}) {
	const notAcceptedCards = allCards
		.filter(
			(item) =>
				item.payment_type === 'card' &&
				!isSupportedCurrency({
					currencyCode,
					supportedCurrencies: item.supported_currencies as unknown as CURRENCIES[]
				})
		)
		.sort((a, b) => (a.order_by > b.order_by ? 1 : -1)) as unknown as Array<SupportedCards>

	return notAcceptedCards
}
