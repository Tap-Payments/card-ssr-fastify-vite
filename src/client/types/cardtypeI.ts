import { CreditCardTypeCardBrandId } from 'credit-card-type/dist/types'

interface code {
	size: number
	name: CreditCardTypeSecurityCodeLabel
}
export interface cardtypeI {
	code: code
	gaps: Array<number>
	type: CreditCardTypeCardBrandId
	niceType: CreditCardTypeCardBrandNiceType
	lengths: Array<number>
	matchStrength: number
	patterns: number[] | [number[]]
}

// get it from library: node_modules/credit-card-type/dist/types.d.ts
export type CreditCardTypeCardBrandNiceType =
	| 'American Express'
	| 'Diners Club'
	| 'Discover'
	| 'Elo'
	| 'Hiper'
	| 'Hipercard'
	| 'JCB'
	| 'Maestro'
	| 'Mastercard'
	| 'Mir'
	| 'UnionPay'
	| 'Visa'
export type CreditCardTypeSecurityCodeLabel = 'CVV' | 'CVC' | 'CID' | 'CVN' | 'CVE' | 'CVP2'
