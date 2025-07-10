import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import HTTPClient, { BackendError } from './axios'
import { BinTypeI } from '@shared/types/BinTypeI'
import { configProps } from '@shared/types/configProps'
import { CardVerifyI } from '@shared/types/CardVerifyI'
import { removeWhitespaces } from '../utils'

// single charge by id to use in /charges/:id
type GetBINRes = BinTypeI
type cardVerifyRes = CardVerifyI
type GetBINProps = {
	configProps: configProps
	binValue: string
	axiosConfig?: AxiosRequestConfig
	refererUrl: string
}

type createCardVerifyType = {
	configProps: configProps
	axiosConfig?: AxiosRequestConfig
	request: {
		source: {
			id: string
		}
		redirect: {
			url: string
		}
		save_card: boolean
		threeDSecure: boolean
		customer: {
			locale: string
			id: string
		}
		currency: string
	}

	refererUrl: string
}
const createCardVerify = async ({ configProps, request, axiosConfig, refererUrl }: createCardVerifyType) => {
	const options: AxiosRequestConfig = {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `${configProps.publicKey}`
		},
		...axiosConfig
	}

	try {
		const res = await HTTPClient.post(`/verify`, request, options)
		return res.data as cardVerifyRes
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

const getBIN = async ({ binValue, configProps, axiosConfig }: GetBINProps): Promise<GetBINRes> => {
	const bin = removeWhitespaces(binValue).substring(0, 10)
	const options: AxiosRequestConfig = {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `${configProps.publicKey}`
		},
		...axiosConfig
	}

	try {
		const res = await HTTPClient.get(`/bin/${bin}`, options)
		return res.data as GetBINRes
	} catch (error: unknown | AxiosError<BackendError>) {
		const err = error as AxiosError<BackendError>
		const BIN_ERROR: BackendError = {
			statusCode: err.response!.status,
			error: err.code!,
			message: err.message
		}
		return Promise.reject(BIN_ERROR)
	}
}

const getCardVerify = async ({
	verifyCardId,
	configProps,
	axiosConfig,
	refererUrl
}: {
	verifyCardId: string
	configProps: configProps
	axiosConfig?: AxiosRequestConfig
	refererUrl: string
}): Promise<cardVerifyRes> => {
	const options: AxiosRequestConfig = {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `${configProps.publicKey}`
		},
		...axiosConfig
	}

	try {
		const res = await HTTPClient.get(`/verify/${verifyCardId}`, options)
		return res.data as cardVerifyRes
	} catch (error: unknown | AxiosError<BackendError>) {
		const err = error as AxiosError<BackendError>
		const BIN_ERROR: BackendError = {
			statusCode: err.response!.status,
			error: err.code!,
			message: err.message
		}
		return Promise.reject(BIN_ERROR)
	}
}

const cardService = {
	getBIN,
	getCardVerify,
	createCardVerify
}

export { cardService }
