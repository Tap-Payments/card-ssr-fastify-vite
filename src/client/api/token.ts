import type { AxiosError, AxiosRequestConfig } from 'axios'
import type { configProps } from '@shared/types/configProps'
import HTTPClient, { type BackendError } from './axios'

import type { Card } from '@shared/types/Card'
import type { TokenTypeI } from '@shared/types/TokenTypeI'
import type { Authentication } from '@shared/types/Authentication'
import { getConsentData, mapCustomerToApi, mapOrderToApi } from '../utils/token'
import { Purpose, Scope } from '@shared/types'

type createTokenRes = TokenTypeI

type createTokenProps = {
	configProps: configProps
	cardValue: string
	dateValue: string
	cvvValue: string
	nameValue?: string
	encryptionKey: string
	axiosConfig?: AxiosRequestConfig
	refererUrl: string
	authentication?: Authentication
	scope?: Scope
	saveCard?: boolean
	isSaveCardSwitchVisible?: boolean
	ip?: string
}

type createTokenSavedCardProps = {
	customer: string
	loadedCard: Card
	configProps: configProps
	cvvValue: string
	encryptionKey: string
	axiosConfig?: AxiosRequestConfig
	refererUrl: string
	authentication?: Authentication
	ip?: string
}
const createTokenSavedCard = async ({
	customer,
	loadedCard,
	configProps,
	cvvValue,
	encryptionKey,
	axiosConfig,
	authentication,
	ip
}: createTokenSavedCardProps): Promise<createTokenRes> => {
	if (typeof window === 'undefined') {
		throw new Error('Token creation is not supported on the server side.')
	}
	const { JSEncrypt } = await import('jsencrypt')

	const jse = new JSEncrypt()
	jse.setPublicKey(encryptionKey)
	const encryptedData = jse.encrypt(cvvValue)

	const consent = getConsentData({
		ip,
		integration: configProps.integration,
		browserName: authentication?.device?.browser
	})

	const obj = {
		saved_card: {
			card_id: loadedCard.id,
			customer_id: customer,
			cvc: encryptedData
		},
		purpose: authentication?.authentication.purpose,
		...consent
	}

	const options: AxiosRequestConfig = {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `${configProps.publicKey}`
		},
		...axiosConfig
	}

	try {
		const res = await HTTPClient.post(`/token`, obj, options)
		return res.data as createTokenRes
	} catch (error: unknown | AxiosError<BackendError>) {
		const err = error as AxiosError<BackendError>
		const TOKEN_ERROR: BackendError = {
			statusCode: err.response!.status,
			error: err.code!,
			message: err.message
		}
		return Promise.reject(TOKEN_ERROR)
	}
}

const createToken = async ({
	cardValue,
	dateValue,
	cvvValue,
	nameValue,
	configProps,
	axiosConfig,
	encryptionKey,
	authentication,
	scope,
	saveCard,
	isSaveCardSwitchVisible,
	ip
}: createTokenProps): Promise<createTokenRes> => {
	if (typeof window === 'undefined') {
		throw new Error('Token creation is not supported on the server side.')
	}
	const { JSEncrypt } = await import('jsencrypt')

	const purpose = authentication?.authentication.purpose
	const key = encryptionKey
	const ExMonth = dateValue.split('/')[0]
	const ExYear = dateValue.split('/')[1]
	const obj = {
		cvc: cvvValue,
		exp_month: ExMonth,
		exp_year: ExYear,
		name: nameValue,
		number: cardValue
	}

	const object = JSON.stringify(obj)
	const jse = new JSEncrypt()
	jse.setPublicKey(key)
	const encryptedData = jse.encrypt(object)
	const options: AxiosRequestConfig = {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `${configProps.publicKey}`
		},
		...axiosConfig
	}

	const mappedPurpose =
		purpose === Purpose.SAVE_TOKEN && scope === Scope.AUTHENTICATED_TOKEN ? Purpose.SAVE_AUTHENTICATED_TOKEN : purpose

	const consent = getConsentData({
		ip,
		integration: configProps.integration,
		browserName: authentication?.device?.browser
	})

	try {
		const res = await HTTPClient.post(
			`/token`,
			{
				encryptedData,
				purpose: mappedPurpose,
				customer: mapCustomerToApi(authentication?.customer),
				consent: isSaveCardSwitchVisible
					? {
							acknowledge: !!saveCard
						}
					: undefined,
				merchant: authentication?.merchant,
				order: mapOrderToApi(authentication),
				payment_agreement: authentication?.paymentAgreement,
				client_ip: ip,
				...consent
			},
			options
		)
		return res.data as createTokenRes
	} catch (error: unknown | AxiosError<BackendError>) {
		const err = error as AxiosError<BackendError>
		const TOKEN_ERROR: BackendError = {
			statusCode: err.response!.status,
			error: err.code!,
			message: err.message
		}
		return Promise.reject(TOKEN_ERROR)
	}
}

const tokenService = {
	createToken,
	createTokenSavedCard
}

export { tokenService }
