import valid from 'card-validator'
import { isValidString } from '@server/utils/string'
import { Integration, Purpose } from '@shared/types'
import type { AppProps } from '@shared/types/Card'
import type { CURRENCIES } from '@shared/types/paymentOption'

export const expireDateValidate = (value: string | number) => {
	const dateValid = valid.expirationDate(value)

	return dateValid
}

/**
 * @description: check if the given date is in the future. uses [card-validator expirationDate](https://github.com/braintree/card-validator#validexpirationdatevalue-stringobject-maxelapsedyear-integer-object)
 * @param value: string
 */
export const isFuture = (value: string) => {
	const { isValid, isPotentiallyValid, month, year } = valid.expirationDate(value, 100)
	return {
		isDateInTheFuture: isValid,
		isPotentiallyValid,
		month,
		year
	}
}

export const validateAppConfig = (values: AppProps) => {
	const {
		encryptionKey,
		paymentOptions,
		cards,
		configValue,
		assets,
		referer,
		permission,
		isNewConfig,
		integrationMode
	} = values
	const code = 400
	if (!encryptionKey) {
		return {
			code,
			description: 'encryptionKey is required'
		}
	}
	if (!paymentOptions) {
		return {
			code,
			description: 'paymentOptions is required'
		}
	}
	if (!cards) {
		return {
			code,
			description: 'cards is required'
		}
	}
	if (!configValue) {
		return {
			code,
			description: 'configuration value is required'
		}
	}
	if (!assets) {
		return {
			code,
			description: 'assets is required'
		}
	}
	if (!referer) {
		return {
			code,
			description: 'referer is required'
		}
	}
	if (
		!paymentOptions.find((payment) =>
			payment.supported_currencies.includes(String(configValue?.paymentOptions?.currencyCode) as CURRENCIES)
		)
	) {
		return {
			code,
			description: 'No payment options available'
		}
	}
	type Auth = NonNullable<AppProps['configValue']>['authentication']
	const authData: Auth = JSON.parse(decodeURIComponent(configValue.authentication as unknown as string))
	const purpose = authData?.authentication.purpose
	const merchantID = authData?.merchant?.id
	const disableValidateMerchant =
		integrationMode === Integration.WEBVIEW && (!configValue.sdkVersion || Number(configValue.sdkVersion) < 1)
	if (!disableValidateMerchant && isNewConfig && !isValidString(merchantID)) {
		return {
			code,
			description: 'The merchant id is required'
		}
	}
	if (!permission.card_wallet && purpose === Purpose.SAVE_TOKEN) {
		return {
			code,
			description: 'Saving token is not enabled for this merchant'
		}
	}
}
