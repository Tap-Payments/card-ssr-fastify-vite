import { FastifyInstance } from 'fastify/types/instance'
import axios from 'axios'
import RedisHelper from './RedisHelper'
import UtilityHelper from './UtilityHelper'
export default class ApiHelper {
	static async postCall(body: any, key: string) {}

	static async getKey(fastify: any, key: string, reply: any) {
		const isSecretKey = await RedisHelper.getKey(fastify, key)
		let secretKey: string | null | void = null
		const body = {
			key
		}
		if (isSecretKey == null) {
			const goLoginResponse = await this.callGologin(body)
			if (goLoginResponse.status != 200 && goLoginResponse.data.data.private_key == undefined) {
				reply.statusCode = 400

				reply.send(goLoginResponse)
				return
			} else {
				await RedisHelper.setKey(fastify, key, goLoginResponse.data.data.private_key, reply)
				secretKey = goLoginResponse.data.data.private_key
			}
		} else {
			secretKey = isSecretKey
		}

		return secretKey
	}
	static async callGologin(body: { key: string; site_url?: string }) {
		try {
			const options = {
				headers: {
					'Content-Type': 'application/json'
				}
			}

			const response = await axios.post(
				`${process.env.API_BASE || 'https://api.tap.company/v2'}/gologin/private`,
				body,
				options
			)

			const data = response.data
			const status = response.status
			return { data, status }
		} catch (error: any) {
			const message: string = error.message ? error.message : ''
			const status: number =
				error !== null && typeof error.response.status === 'number' && typeof error.response === 'object'
					? error.response.status
					: 500

			return { status, message }
		}
	}
	static isLivePublicKey(pk: string) {
		return pk.includes('pk_live')
	}
	static async mapRequestFromHeader(requestBody: any, headerApplication: string): Promise<any> {
		const ipAddress = requestBody.client_ip
		let responseIpInfo: any = null
		if (ipAddress && process.env.IP_INFO_ACCESS_KEY) {
			responseIpInfo = await axios.get(
				`https://api.ipapi.com/${ipAddress}?access_key=${process.env.IP_INFO_ACCESS_KEY}`
			)
		}

		//handle mapping without consent
		if (headerApplication) {
			const decodedApplication = UtilityHelper.parseHeaderString(headerApplication)

			const { at, bn, bi, cu, aid, an, av, ro, rov, rm, rt, rn } = decodedApplication

			if (!requestBody.browser) {
				requestBody.browser = {}
			}

			if (!requestBody.app) {
				requestBody.app = {}
			}

			const device = requestBody.device
			if (!device) {
				requestBody.device = {}
			}
			if (!device.operating_system) {
				device.operating_system = {}
			}

			if (!device.brand) {
				device.brand = {}
			}

			device.source = UtilityHelper.replaceIfPresent(at === 'browser' ? 'web' : at, device.source)
			requestBody.browser.name = UtilityHelper.replaceIfPresent(bn, requestBody.browser.name)
			requestBody.browser.id = UtilityHelper.replaceIfPresent(bi, requestBody.browser.id)
			requestBody.app.store_id = UtilityHelper.replaceIfPresent(cu, requestBody.app.store_id)
			requestBody.app.name = UtilityHelper.replaceIfPresent(
				aid != undefined && aid !== '' ? aid : an,
				requestBody.app.name
			)
			requestBody.app.version = UtilityHelper.replaceIfPresent(av, requestBody.app.version)
			device.operating_system.name = UtilityHelper.replaceIfPresent(ro, device.operating_system?.name)
			device.operating_system.version = UtilityHelper.replaceIfPresent(rov, device.operating_system?.version)
			device.brand.name = UtilityHelper.replaceIfPresent(ro != undefined && ro !== '' ? ro : rm, device.brand?.name)
			device.brand.type = UtilityHelper.replaceIfPresent(rt, device.brand?.type)
			device.name = UtilityHelper.replaceIfPresent(rn, device?.name)
			if (device.source == 'app') {
				let store = ''
				if (device.operating_system.name?.toLowerCase() === 'ios') store = 'app_store'
				if (device.operating_system.name?.toLowerCase() === 'android') store = 'play_store'
				requestBody.app.store = store
			} else {
				requestBody.app.store = device.operating_system.name
			}
			if (responseIpInfo) {
				if (responseIpInfo.status == 200 && responseIpInfo.data.ip == ipAddress) {
					if (responseIpInfo.data.country_code) {
						requestBody.device.country_code = responseIpInfo.data.country_code
					}
					if (responseIpInfo.data.ip) {
						requestBody.device.ip = responseIpInfo.data.ip
					}
				}
			}
		}
		return requestBody
	}
}
