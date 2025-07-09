import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'

import HTTPClient, { BackendAPIError } from './HTTPClient'

const getTransaction = async (key: string, id: string, object: string) => {
	const options: AxiosRequestConfig = {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${key}`
		}
	}

	try {
		const res = await HTTPClient.get(`/${object === 'authorize' ? 'authorize' : 'charges'}/${id}`, options)
		return res
	} catch (error: unknown | AxiosError<BackendAPIError>) {
		const err = error as AxiosError<BackendAPIError>

		return Promise.reject(err)
	}
}

const transactionService = {
	getTransaction
}

export { transactionService }
