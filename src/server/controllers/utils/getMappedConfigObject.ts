import type { ConfigObject, Device } from '../../types/config'
import { ColorStyle, FullThemeMode, Scope, Theme } from '../../types/enums'
import { getMappedAuth } from './getMappedAuth'
import { getMappedPaymentOption } from './getMappedPaymentOption'

interface GetMappedConfigObjectProps {
	config: ConfigObject
	device: Device
}

export function getMappedConfigObject({ config, device }: GetMappedConfigObjectProps) {
	const mappedConfig = {
		integration: config.integration ?? 'merchant',
		mid: config.merchant?.id,
		themeMode: getFullThemeMode(device.themeMode, config.interface?.colorStyle),
		application: config.headers?.application,
		mdn: config.headers?.mdn,
		scope: config.scope ?? Scope.TOKEN,
		features: config.features ?? {},
		paymentOptions: getMappedPaymentOption({ config, device }),
		authentication: getMappedAuth({ config, device }),
		sdkVersion: config.sdkVersion,
		domain: config.headers?.domain,
		acceptance: config.acceptance
	}
	return {
		...mappedConfig,
		features: mappedConfig.features ? JSON.stringify(mappedConfig.features) : '',
		paymentOptions: mappedConfig.paymentOptions ? JSON.stringify(mappedConfig.paymentOptions) : '',
		authentication: mappedConfig.authentication ? JSON.stringify(mappedConfig.authentication) : ''
	}
}

export const getFullThemeMode = (themeMode?: Theme, colorStyle?: ColorStyle): FullThemeMode => {
	if (themeMode === Theme.DARK) {
		return colorStyle === ColorStyle.COLORED ? FullThemeMode.DARK_COLORED : FullThemeMode.DARK
	}
	return colorStyle === ColorStyle.MONOCHROME ? FullThemeMode.LIGHT_MONO : FullThemeMode.LIGHT
}
