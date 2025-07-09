import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import ErrorHandler from '../services/ErrorHandler'

const HTTPClient = axios.create({
	baseURL: process.env.API_BASE || 'https://api.tap.company/v2',
	headers: {
		'Content-Type': 'application/json',
		priority: 'high'
	}
})

HTTPClient.interceptors.request.use(
	(config: InternalAxiosRequestConfig<unknown>) => {
		// edit axios header before sending request, if needed.
		console.error('interceptors.request', JSON.stringify(config))
		return config
	},
	(error) => Promise.reject(error)
)

export type BackendAPIError = {
	statusCode: number
	error?: string
	data?: Array<object>
}

export type SlackAPIError = {
	requestHeaders: any
	statusCode: number
	error?: string
	data?: Array<object> | undefined
	requestBody: any
	requestUrl: any
	requestMethod: any
}

// ** Add request/response interceptor
HTTPClient.interceptors.response.use(
	(response: AxiosResponse<unknown, unknown>) => {
		ErrorHandler.logToSlack('', ErrorHandler.slackMapping(response, 'success'), true)
		return response
	},
	(error: AxiosError<BackendAPIError>) => {
		const err = error as AxiosError

		const ERROR = {
			statusCode: err.response!.status,
			error: err.response?.statusText,
			data: err.response?.data
		} as BackendAPIError

		ErrorHandler.logToSlack('', ErrorHandler.slackMapping(error, 'error'))
		return Promise.reject(ERROR)
	}
)

export default HTTPClient
