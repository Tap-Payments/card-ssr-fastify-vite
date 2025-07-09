import path from 'path'
import fs from 'fs'
import RedisHelper from '../services/RedisHelper'
import CryptoHelper from '../services/CryptoHelper'
import API from '../api'
import type { BackendAPIError } from '../api/HTTPClient'
import ErrorHandler from '../services/ErrorHandler'
import ApiHelper from '../services/ApiHelper'
import { Integration } from '../../shared/types'
import type { ConfigObject, Device } from '../types/config'
import { getMappedConfigObject } from './utils/getMappedConfigObject'
import { getBackupConfig } from './utils/getBackupConfig'
import type { getMappedAuth } from './utils/getMappedAuth'
import type { getMappedPaymentOption } from './utils/getMappedPaymentOption'
class Controller {
	constructor() {}

	isCardLoadedInternally(integration: Integration, session: string) {
		return [Integration.CHECKOUT, Integration.WEBVIEW].includes(integration) && !!session
	}

	async makeFrame(request: any, fastify: any, reply: any) {
		let isNewConfig = false
		if (request.query.config) {
			isNewConfig = true
			const config = JSON.parse(request.query.config) as ConfigObject
			const device = JSON.parse(request.query.device) as Device
			request.query = {
				...request.query,
				...getMappedConfigObject({ config, device })
			}
		} else {
			isNewConfig = false
			const mappedConfig = getBackupConfig({ query: request.query })
			request.query = {
				...request.query,
				...mappedConfig
			}
		}

		const {
			publicKey,
			referer: refererQuery,
			session: checkoutSession,
			mdn: mdnQuery = '',
			application,
			integration,
			mid,
			sdkSource,
			domain
		} = request.query
		const { query } = request

		if (query.paymentOptions && typeof query.paymentOptions === 'string') {
			query.paymentOptions = JSON.parse(decodeURIComponent(query.paymentOptions))
		}
		if (query.style) {
			query.style = JSON.parse(query.style)
		}
		if (query.errors) {
			query.errors = JSON.parse(query.errors)
		}

		const {
			customer: customerId,
			supportedCurrencies,
			supportedPaymentMethods,
			cardCVV,
			currencyCode
		} = query.paymentOptions as ReturnType<typeof getMappedPaymentOption>

		const {
			authentication: { purpose }
		} = JSON.parse(decodeURIComponent(query.authentication)) as ReturnType<typeof getMappedAuth>

		const acceptance = request.query.acceptance as ConfigObject['acceptance']

		const request_body = {
			customer: { id: customerId },
			payment_type: 'CARD',
			merchant_id: mid,
			supported_currencies: supportedCurrencies,
			supported_payment_methods: supportedPaymentMethods,
			supported_regions: acceptance?.supportedRegions,
			supported_countries: acceptance?.supportedCountries,
			supported_payment_types: acceptance?.supportedPaymentTypes,
			supported_schemes: acceptance?.supportedSchemes,
			scope: query.scope,
			purpose: purpose,
			currency: currencyCode,
			field_visibility: {
				card: {
					cvv: cardCVV ?? true
				}
			}
		}

		const decryptedMdn = await CryptoHelper.decryptMdn(mdnQuery.replaceAll(' ', '+'))
		const referer = !!refererQuery ? CryptoHelper.decryptMdn(refererQuery.replaceAll(' ', '+')) : decryptedMdn
		try {
			if (this.isCardLoadedInternally(integration, checkoutSession)) {
				const decodedToken = fastify.jwt.decode(checkoutSession)
				const isLivePK = ApiHelper.isLivePublicKey(publicKey)
				CryptoHelper.decrypt(decodedToken.key, isLivePK)
				await RedisHelper.setKey(fastify, `${publicKey}`, decodedToken.key, reply)
				reply.statusCode = 200
				return {
					ENABLE_REDUX_TOOLKIT: process.env.ENABLE_REDUX_TOOLKIT,
					referer,
					encryption_key: '',
					config: JSON.stringify(request.query),
					payment_options: JSON.stringify([]),
					cards: JSON.stringify([]),
					merchantAssets: JSON.stringify([]),
					error: JSON.stringify(null),
					integration: JSON.stringify(integration),
					session: JSON.stringify(checkoutSession),
					permission: JSON.stringify(null),
					isNewConfig: JSON.stringify(isNewConfig)
				}
			}
			const { data } = await API.profileService.cardProfile(publicKey, application, decryptedMdn, request_body)
			const decodedToken = fastify.jwt.decode(data.merchant.session_token)
			await RedisHelper.setKey(fastify, `${publicKey}`, decodedToken.api_key, reply)
			const {
				merchant: { encryption_key, permission, powered_by },
				payment_options,
				assests: merchantAssets
			} = data

			reply.statusCode = 200
			return {
				ENABLE_REDUX_TOOLKIT: process.env.ENABLE_REDUX_TOOLKIT,
				referer,
				encryption_key,
				config: JSON.stringify(request.query),
				payment_options: JSON.stringify(payment_options.payment_methods),
				cards: JSON.stringify(payment_options.cards),
				merchantAssets: JSON.stringify(merchantAssets),
				error: JSON.stringify(null),
				integration: JSON.stringify(integration),
				session: JSON.stringify(null),
				permission: JSON.stringify({
					...permission,
					powered: powered_by
				}),
				isNewConfig: JSON.stringify(isNewConfig)
			}
		} catch (error: any) {
			const err = error as BackendAPIError
			const errorData = err.data?.[0] ||
				err.data || {
					code: 'UNKNOWN_ERROR',
					message: error.message || 'Unknown error'
				}
			reply.statusCode = err.statusCode || 400
			return {
				ENABLE_REDUX_TOOLKIT: process.env.ENABLE_REDUX_TOOLKIT,
				referer,
				encryption_key: '',
				config: JSON.stringify(request.query),
				payment_options: JSON.stringify([]),
				cards: JSON.stringify([]),
				merchantAssets: JSON.stringify([]),
				error: JSON.stringify(errorData),
				integration: JSON.stringify(integration),
				session: JSON.stringify(null),
				permission: JSON.stringify(null),
				isNewConfig: JSON.stringify(isNewConfig)
			}
		} finally {
			const invalidHosts = ['0.0.0.0', 'dev', 'staging']
			if (!invalidHosts.some((substring) => request.headers.host.includes(substring))) {
				ErrorHandler.logSdkSourceToSlack({
					publicKey,
					mid,
					sdkSource,
					host: request.headers.host,
					client: domain || decryptedMdn
				})
			}
		}
	}

	async getCardVerify(request: any, fastify: any, reply: any) {
		try {
			const { id } = request.params
			const response = await API.cardService.getCardVerify(request.xTapSecretKey, id)

			const { data, status } = response
			await reply.code(status).send(data)
			return
		} catch (error: unknown | BackendAPIError) {
			const err = error as BackendAPIError
			ErrorHandler.sendErrorResponse(err, reply)
			return
		}
	}

	async getTransaction(request: any, fastify: any, reply: any) {
		try {
			const { id, object } = request.params
			const response = await API.transactionService.getTransaction(request.xTapSecretKey, id, object)
			const { data, status } = response
			await reply.code(status).send(data)
			return
		} catch (error: unknown | BackendAPIError) {
			const err = error as BackendAPIError
			ErrorHandler.sendErrorResponse(err, reply)
			return
		}
	}
	async createCardVerify(request: any, fastify: any, reply: any) {
		try {
			const response = await API.cardService.createCardVerify(request.xTapSecretKey, request.body)

			const { data, status } = response
			await reply.code(status).send(data)
			return
		} catch (error: unknown | BackendAPIError) {
			const err = error as BackendAPIError
			ErrorHandler.sendErrorResponse(err, reply)
			return
		}
	}
	async createToken(request: any, fastify: any, reply: any) {
		try {
			const { encryptedData, ...otherData } = request.body
			let request_token: any = {}
			if (encryptedData != undefined) {
				request_token = {
					card: {
						crypted_data: encryptedData
					},
					...otherData
				}
			} else {
				request_token = request.body
			}

			const mappedRequest = await ApiHelper.mapRequestFromHeader(request_token, request.headers.application)

			const response = await API.cardService.createToken(request.xTapSecretKey, mappedRequest)
			const { data, status } = response
			await reply.code(status).send(data)
			return
		} catch (error: unknown | BackendAPIError) {
			const err = error as BackendAPIError
			ErrorHandler.sendErrorResponse(err, reply)
			return
		}
	}

	async createAuthenticate(request: any, fastify: any, reply: any) {
		try {
			const { encryptedData, ...otherData } = request.body
			const request_authenticate: any = request.body

			const mappedRequest = await ApiHelper.mapRequestFromHeader(request_authenticate, request.headers.application)
			const response = await API.authenticateService.createAuthenticate(request.xTapSecretKey, mappedRequest)

			const { data, status } = response
			await reply.code(status).send(data)
			return
		} catch (error: unknown | BackendAPIError) {
			const err = error as BackendAPIError
			ErrorHandler.sendErrorResponse(err, reply)
			return
		}
	}

	async getAuthenticate(request: any, fastify: any, reply: any) {
		try {
			const response = await API.authenticateService.getAuthenticate(request.xTapSecretKey, request.params.id)

			const { data, status } = response
			await reply.code(status).send(data)
			return
		} catch (error: unknown | BackendAPIError) {
			const err = error as BackendAPIError
			ErrorHandler.sendErrorResponse(err, reply)
			return
		}
	}

	async getBin(request: any, fastify: any, reply: any) {
		try {
			const response = await API.cardService.getBin(request.xTapSecretKey, request.params.id)

			const { data, status } = response
			await reply.code(status).send(data)
			return
		} catch (error: unknown | BackendAPIError) {
			const err = error as BackendAPIError
			ErrorHandler.sendErrorResponse(err, reply)
			return
		}
	}
	async makeWrapper(_request: any, _fastify: any, reply: any) {
		const manifest_path = path.join(__dirname, '../../static/wrapper/manifest.json')
		const manifest = fs.readFileSync(manifest_path, 'utf-8')
		const assets = JSON.parse(manifest)
		const wrapper_path = '/dist/server/views/wrapper.ejs'
		return reply.view(wrapper_path, {
			ENABLE_REDUX_TOOLKIT: process.env.ENABLE_REDUX_TOOLKIT,
			assets
		})
	}
}
const controller = new Controller()
export default controller
