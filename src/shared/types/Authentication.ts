import { Customer } from './Customer'

export interface Authentication {
	id?: string
	mode?: string
	amount: number
	currency: string
	save_card?: boolean
	description?: string
	metadata?: Record<string, string>
	cardHolderLogin?: {
		type?: string
		timestamp?: string
	}
	intent?: {
		id?: string
	}
	reference?: {
		transaction: string
		order: string
	}
	invoice?: {
		id: string
	}
	order: {
		amount: number
		currency: string
		id?: string
		description?: string
		metadata?: Record<string, string>
		reference?: string
	}
	source: SourceI
	customer: Customer
	authentication: {
		channel: string
		purpose: string
	}
	merchant?: {
		id: string
	}
	redirect: Post
	post: Post
	height3DS?: number

	paymentAgreement?: {
		id?: string
		type?: string
		contract: {
			id?: string
			type?: string
			period?: {
				start_date?: number
				end_date?: number
				auto_renewal?: boolean
			}
		}
		variable_amount: {
			id?: string
			maximum_amount?: number
		}
		scheduled_payments: {
			id?: string
			count?: number
			frequency?: {
				period?: string
				count?: number
			}
		}
	}
	airline?: {
		id?: string
	}
	device: {
		ipAddress?: string
		browser: string
		browserDetails: {
			screenHeight: string
			screenWidth: string
			language: string
			colorDepth: string
			javaEnabled: boolean
			javaScriptEnabled: boolean
			timeZone: string
			acceptHeaders: string
			'3DSecureChallengeWindowSize': string
		}
	}
}

export interface AuthenticationResponse {
	id: string
	object: string
	live_mode: boolean
	api_version: string
	status: string
	created: string
	amount: number
	currency: string
	description: string
	transaction: Transaction
	response: Response
	metadata: Metadata
	reference: Reference
	invoice: Invoice
	customer: Customer
	source: Source
	merchant: Invoice
	card: Card
	authentication: AuthenticationI
	redirect: Post
	post: Post
	auth_url: string
}

export interface AuthenticationI {
	channel: string
	purpose: string
	url?: string
}

export interface Card {
	first_six: string
	scheme: string
	brand: string
	type?: string
	last_four: string
	name: string
	funding?: string
}

export interface SourceI {
	id: string
	card: {
		name: string
		card_info: string
		firstSix: string
		lastFour: string
		brand: string
		scheme: string
		category: string
	}
}

export interface Phone {
	country_code: string
	number: string
}

export interface Invoice {
	id: string
}

export interface Metadata {
	udf1: string
	udf2: string
}

export interface Post {
	url: string
}

export interface Reference {
	transaction: string
	order: string
}

export interface Response {
	code: string
	message: string
}

export interface Source {
	id: string
	card: Card
}

export interface Transaction {
	id: string
	type: string
	timezone: string
	created: string
}
