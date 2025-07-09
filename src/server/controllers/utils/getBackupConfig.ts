import { Integration, Currencies, Direction, Edges, Locale, Scope, Theme } from '../../types/enums'
import type { OldPaymentOptions } from '../../types/configOld'
import { getMappedConfigObject } from './getMappedConfigObject'
import type { ConfigObject, Device } from '../../types/config'
import { Purpose } from '../../../shared/types'
import { PAYMENT_METHODS } from '../../../shared/types/paymentOption'

interface GetBackupConfigProps {
	query: any
}

export function getBackupConfig({ query }: Readonly<GetBackupConfigProps>) {
	const mid = query.mid as string
	const application = query.application as string
	const paymentOptions: OldPaymentOptions | undefined = query.paymentOptions && JSON.parse(query.paymentOptions)
	const integration = query.integration as Integration
	const themeMode = query.themeMode as Theme

	const publicKey = query.publicKey as string
	const mdn = query.mdn as string
	const session = query.session as string

	const direction = paymentOptions?.direction ?? Direction.LTR

	const backupConfig = {
		scope: Scope.TOKEN,
		operator: {
			publicKey: publicKey
		},
		purpose: Purpose.CHARGE,
		merchant: {
			id: mid ?? undefined
		},
		transaction: {
			reference: undefined,
			intent: undefined,
			metadata: undefined,
			cardHolderLogin: undefined,
			paymentAgreement: undefined,
			airline: undefined
		},
		invoice: undefined,
		order: {
			amount: 0,
			currency: paymentOptions?.currencyCode ?? Currencies.SAR,
			id: '',
			description: '',
			reference: '',
			metadata: {}
		},
		customer: {
			id: paymentOptions?.customer,
			nameOnCard: paymentOptions?.preLoadCardName,
			editable: paymentOptions?.cardNameEditable
		},
		acceptance: {
			supportedSchemes:
				paymentOptions?.supportedPaymentMethods?.map((scheme) =>
					scheme.toUpperCase() === PAYMENT_METHODS.AMEX ? PAYMENT_METHODS.AMERICAN_EXPRESS : scheme.toUpperCase()
				) ?? [],
			supportedFundSource: paymentOptions?.cardFundingSource ? [paymentOptions?.cardFundingSource] : []
		},
		fieldVisibility: {
			card: {
				cardHolder: paymentOptions?.collectHolderName ?? true,
				cvv: paymentOptions?.cardCVV ?? true,
				savedCardCVV: paymentOptions?.savedCardCVV ?? true
			}
		},
		features: {
			acceptanceBadge: paymentOptions?.displayPaymentBrands ?? true,
			customerCards: {
				saveCard: paymentOptions?.saveCardOption?.toLowerCase() === 'none' ? false : true,
				autoSaveCard: true
			}
		},
		interface: {
			locale: paymentOptions?.locale ?? Locale.EN,
			theme: themeMode ?? Theme.DYNAMIC,
			edges: paymentOptions?.edges ?? Edges.CIRCULAR,
			cardDirection: paymentOptions?.forceLtr ? Direction.LTR : direction,
			powered: true,
			loader: paymentOptions?.showLoadingState ?? true
		},
		reditrect: {
			url: ''
		},
		post: {
			url: ''
		},
		height3DS: undefined,
		integration: integration ?? Integration.MERCHANT,
		sortedCurrencyCode: paymentOptions?.sortedCurrencyCode,

		checkoutProfileResponse: {
			session: session,
			merchant: {
				id: ''
			},
			payment_options: {
				id: '',
				cards: [],
				order: {},
				payment_methods: [],
				supported_currencies: []
			},
			assests: {}
		},

		headers: {
			mdn: mdn,
			application: application,
			ip: ''
		}
	} satisfies ConfigObject

	const backupDevice = {
		themeMode: themeMode ?? Theme.DYNAMIC,
		browserLocale: paymentOptions?.locale ?? Locale.EN,
		browser: '',
		browserDetails: {
			acceptHeaders: 'application/json',
			'3DSecureChallengeWindowSize': 'FULL_SCREEN'
		}
	} satisfies Device
	const mappedConfig = getMappedConfigObject({ config: backupConfig, device: backupDevice })

	return mappedConfig
}
