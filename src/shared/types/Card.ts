import type { Assets } from './assets'
import type { configProps } from './configProps'
import type { Integration, ThemeMode } from './enum'
import type { Logos, PaymentOption } from './paymentOption'

export interface Card {
	id: string
	fingerprint: string
	payment_method_id: number
	object: string
	last_four: string
	brand: string
	scheme: string
	image: string
	name: string
	first_six: string
	currency: string
	expiry: {
		month: string
		year: string
	}
	order_by: number
	supported_currencies: string[]
	funding: string
	logos: Logos
}

interface InputEvent {
	isUserDoneTyping: boolean
	isValid: boolean
	errorMessage: string | null
}

export interface CardEvent {
	number: InputEvent
	date: InputEvent
	cvv: InputEvent
	name: InputEvent
	isAllInputsValid: boolean
}

export interface AppProps {
	errorData: any | null
	referer: string | null
	encryptionKey: string | null
	paymentOptions: Array<PaymentOption>
	cards: Array<Card>
	configValue: configProps | null
	themeMode?: ThemeMode
	assets?: Assets
	integrationMode?: Integration
	session?: string
	permission: {
		card_wallet: boolean
		threeDSecure: boolean
		pci_dss: boolean
		powered: boolean
	}
	isNewConfig?: boolean
}

export interface CardInputs {
	cardNumber?: string
	expiryDate?: string
	cvv?: string
	cardHolderName?: string
}
