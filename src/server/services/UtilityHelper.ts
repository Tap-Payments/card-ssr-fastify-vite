import CryptoHelper from './CryptoHelper'

export default class UtilityHelper {
	static parseHeaderString = (headerString: string): Record<string, string> => {
		const headers: Record<string, string> = {}
		const keyValuePairs = headerString.split('|')

		keyValuePairs.forEach((pair) => {
			const [key, ...values] = pair.split('=')
			const value = values.join('=').replace(/ /g, '+')
			// console.log(`${key}:${value}`);
			try {
				headers[key] = CryptoHelper.decryptMdn(value)
			} catch (error) {
				headers[key] = value
			}
			console.log(`${key}:${headers[key]}`)
		})
		return headers
	}
	static mapKeys = (input: Record<string, string>): Record<string, string> => {
		const keyMapping: Record<string, string> = {
			cu: 'appID',
			al: 'appLocale',
			at: 'appType',
			di: 'deviceID',
			aid: 'requirer',
			ro: 'requirerOS',
			rov: 'requirerOSVersion',
			av: 'requirerVersion',
			rn: 'requirerDeviceName',
			rt: 'requirerDeviceType',
			rm: 'requirerDeviceModel',
			rsn: 'requirerSimNetworkName',
			rsc: 'requirerSimCountryIso',
			bb: 'browserBuild',
			bi: 'browserID',
			bn: 'browserName',
			bua: 'browserUserAgent',
			bv: 'browserVersion'
		}

		const result: Record<string, string> = {}

		for (const key in input) {
			if (keyMapping[key]) {
				result[keyMapping[key]] = input[key]
			} else {
				result[key] = input[key]
			}
		}
		if (result['requirerDeviceModel'] === '' && result['rb']) {
			result['requirerDeviceModel'] = result['rb']
		}
		if (result['requirer'] === '' && result['an']) {
			result['requirer'] = result['an']
		}
		return result
	}
	/**
	 * method replaces source with target key if it exists, other wise return target
	 * @param source
	 * @param target
	 * @returns
	 */
	static replaceIfPresent(source: any, target: any): string {
		if (source !== undefined && source !== null) {
			if (typeof source === 'object' && typeof target === 'object') {
				// Both source and target are objects, recursively update properties
				for (const key in source) {
					if (Object.prototype.hasOwnProperty.call(source, key)) {
						target[key] = UtilityHelper.replaceIfPresent(source[key], target[key])
					}
				}
			} else {
				// Either source or target is not an object, update directly
				target = source
			}
		}
		return target
	}
}
