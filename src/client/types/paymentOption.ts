export interface ImageUrl {
	svg: string
	png: string
}

export interface ImageTheme extends ImageUrl {
	disabled: ImageUrl
	currency_widget: ImageUrl
}

export interface Logos {
	dark: ImageTheme
	light: ImageTheme
	light_mono: ImageTheme
	dark_colored: ImageTheme
}

export interface PaymentOption {
	id: string
	source_id?: string
	name: PAYMENT_METHODS
	name_ar?: string
	image: string
	payment_type: PaymentType
	supported_card_brands: PAYMENT_METHODS[]
	supported_currencies: CURRENCIES[]
	order_by: number
	cc_markup: number
	asynchronous: boolean
	threeDS: string
	api_version: number
	api_version_minor: number
	allowed_auth_methods?: string[]
	gateway_name?: string
	gateway_merchant_id?: string
	logos: Logos
	isDisabled: boolean
}

export interface SupportedCards extends Omit<PaymentOption, 'name'> {
	name: CardBrands
	payment_type: 'card'
}
export enum CURRENCIES {
	AED = 'AED',
	BHD = 'BHD',
	EGP = 'EGP',
	EUR = 'EUR',
	GBP = 'GBP',
	KWD = 'KWD',
	OMR = 'OMR',
	QAR = 'QAR',
	SAR = 'SAR',
	USD = 'USD'
}
export enum CURRENCY_TITLE {
	AED = 'UAE Dirham',
	BHD = 'Bahraini Dinar',
	EGP = 'Egyptian Pound',
	EUR = 'Euro',
	GBP = 'UK Pound Sterling',
	KWD = 'Kuwaiti Dinar',
	OMR = 'Omani Riyal',
	QAR = 'Qatari Riyal',
	SAR = 'Saudi Riyal',
	USD = 'US Dollar'
	// "LBP": 'Lebanon Pound',
	// "IQD": 'Iraqi Dinar',
	// "MAD": 'Moroccan Dirham',
	// "JOD": 'Jordanian Dinar',
	// "LYD": 'Libyan Dinar',
	// "SOS": 'Somali Shilling',
	// "SDG": 'Sudanese Pound',
	// "SYP": 'Syrian Pound',
	// "YER": 'Yemeni Rial',
	// "IRR": 'Iranian Rial',
}

export type PaymentType =
	| 'web'
	| 'card'
	| 'apple_pay'
	| 'google_pay'
	| 'benefit_pay'
	| 'wallet'
	| 'bank_transfer'
	| 'cash'
	| 'voucher'
	| 'installment'
	| 'prepaid_card'
	| 'digital_wallet'
	| 'mobile_wallet'
	| 'qr_code'
	| 'knet'
	| 'samsung_pay'
	| 'c2p'

export enum PAYMENT_METHODS {
	APPLE_PAY = 'APPLE_PAY',
	GOOGLE_PAY = 'GOOGLE_PAY',
	AMEX = 'AMEX',
	AMERICAN_EXPRESS = 'AMERICAN_EXPRESS',
	BENEFIT = 'BENEFIT',
	BENEFITPAY = 'BENEFITPAY',
	CASH_COLLECTED = 'CASH_COLLECTED',
	CASH_DEPOSITED = 'CASH_DEPOSITED',
	CASH = 'CASH',
	CHEQUE = 'CHEQUE',
	DIRCONTENTS = 'DIRCONTENTS',
	FAWRY = 'FAWRY',
	KNET = 'KNET',
	MADA = 'MADA',
	MASTERCARD = 'MASTERCARD',
	MAESTRO = 'MAESTRO',
	NAPS = 'NAPS',
	OMANNET = 'OMANNET',
	// OMAN_NET = 'OMAN_NET',
	SADAD = 'SADAD',
	STCPAY = 'STCPAY',
	VISA = 'VISA',
	VISA_ELECTRON = 'VISA_ELECTRON',
	CAREEM_PAY = 'CAREEM_PAY',
	Buy_with_Careem_Pay = 'Buy with Careem Pay',
	QPAY = 'QPAY',
	MEEZA = 'MEEZA',
	TPAY = 'TPAY',
	PAYPAL = 'PAYPAL',
	POSTPAY = 'postpay',
	WALLET = 'WALLET',
	TABBY = 'TABBY',
	TABBY_INSTALLMENT = 'TABBY_INSTALLMENT',
	UNSPECIFIED = 'UNSPECIFIED',
	CLICK2PAY = 'CLICK2PAY'
}

// taken from https://github.com/braintree/credit-card-type
export enum CardBrands {
	AMERICAN_EXPRESS = 'AMERICAN_EXPRESS',
	DINERS_CLUB = 'DINERS_CLUB',
	DISCOVER = 'DISCOVER',
	ELO = 'ELO',
	HIPER = 'HIPER',
	HIPERCARD = 'HIPERCARD',
	JCB = 'JCB',
	MAESTRO = 'MAESTRO',
	MASTERCARD = 'MASTERCARD',
	MIR = 'MIR',
	UNIONPAY = 'UNIONPAY',
	VISA = 'VISA'
}
