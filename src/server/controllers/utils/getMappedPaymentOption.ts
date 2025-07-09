import { PAYMENT_METHODS } from '../../../shared/types/paymentOption'
import type { ConfigObject, Device } from '../../types/config'
import { Direction, Locale } from '../../types/enums'

export const mappingCardFundingSource = (array?: Array<string>) => {
	if (!array) {
		return 'all'
	}
	if (array.length === 1) {
		return array[0].toLowerCase()
	}
	const isCredit = array.includes('CREDIT')
	const isDebit = array.includes('DEBIT')
	if (isCredit && isDebit) {
		return 'all'
	}
	if (isCredit) {
		return 'credit'
	}
	if (isDebit) {
		return 'debit'
	}
	return 'all'
}

interface GetMappedPaymentOptionProps {
	config: ConfigObject
	device: Device
}
export function getMappedPaymentOption({ config, device }: Readonly<GetMappedPaymentOptionProps>) {
	const supportedPaymentMethods = config.acceptance?.supportedSchemes?.map((scheme) =>
		scheme.toUpperCase() === PAYMENT_METHODS.AMEX ? PAYMENT_METHODS.AMERICAN_EXPRESS : scheme.toUpperCase()
	)
	const supportedFundSource = config.acceptance?.supportedFundSource?.map((scheme) => scheme.toUpperCase())

	const supportedCurrencies =
		config.checkoutProfileResponse?.payment_options?.supported_currencies?.map((curr) => curr.toUpperCase()) ?? []

	const mappedPaymentOption = {
		locale: config.interface?.locale === Locale.DYNAMIC ? device.browserLocale || 'en' : config.interface?.locale,
		direction: config.interface?.cardDirection === Direction.DYNAMIC ? undefined : config.interface?.cardDirection,
		showLoadingState: config.interface?.loader,
		collectHolderName: config.fieldVisibility?.card?.cardHolder ?? true,
		preLoadCardName: config.customer?.nameOnCard ?? '',
		cardNameEditable: config.customer?.editable ?? true,
		currencyCode: config.order.currency?.toUpperCase(),
		customer: config.customer?.id,
		cardFundingSource: mappingCardFundingSource(supportedFundSource), //string //'all','credit','debit'
		saveCardOption: config.features?.customerCards?.saveCard === false ? 'none' : 'all', //'all' | 'none'
		// forceLtr?: boolean
		edges: config.interface?.edges,
		displayPaymentBrands: config.features?.acceptanceBadge ?? true,
		sortedCurrencyCode: config.sortedCurrencyCode?.toUpperCase(),
		cardCVV: config.fieldVisibility?.card?.cvv ?? true,
		savedCardCVV: config.fieldVisibility?.card?.savedCardCVV ?? true,
		supportedPaymentMethods,
		supportedPaymentAuthentications: config.acceptance?.supportedPaymentAuthentications,
		//TODO checkout integration
		supportedCurrencies
	}
	return mappedPaymentOption
}
