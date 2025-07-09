import { AxiosError, AxiosRequestConfig } from 'axios'

import HTTPClient, { BackendAPIError } from './HTTPClient'
const cardProfile = async (publicKey: string, application: string, mdn: string, request: any) => {
	const options: AxiosRequestConfig = {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${publicKey}`,
			mdn: mdn,
			application: application
		}
	}

	try {
		const res = await HTTPClient.post(`/gosell/cardProfile`, { ...request }, options)
		return res
	} catch (error: unknown | AxiosError<BackendAPIError>) {
		const err = error as AxiosError<BackendAPIError>

		return Promise.reject(err)
	}
}

const profileService = {
	cardProfile
}

export { profileService }
