import type { ConfigObject, Device } from '../../types/config'
import { getMappedPurpose } from './getMappedPurpose'
import { resetEmptyString } from './string'

interface GetMappedAuthProps {
	config: ConfigObject
	device: Device
}
export function getMappedAuth({ config, device }: Readonly<GetMappedAuthProps>): any {
	const mappedAuth = {
		amount: config.order.amount,
		currency: config.order.currency?.toUpperCase(),
		description: config.order.description,
		metadata: config.transaction?.metadata,
		paymentAgreement: config.transaction?.paymentAgreement,
		intent: config.transaction?.intent,
		cardHolderLogin: config.transaction?.cardHolderLogin,
		reference: {
			order: resetEmptyString(config.order?.reference ?? config?.order?.id),
			transaction: resetEmptyString(config.transaction?.reference ?? config.order?.reference)
		},
		customer: config.customer,
		invoice: config.invoice,
		authentication: {
			channel: 'PAYER_BROWSER',
			purpose: getMappedPurpose(config.purpose)
		},
		post: config.post,
		order: {
			...config.order,
			currency: config.order.currency?.toUpperCase(),
			id: ''
		},
		...(config.merchant?.id && {
			merchant: { id: config.merchant?.id }
		}),
		height3DS: config.height3DS,
		device: {
			browser: device.browser,
			browserDetails: device.browserDetails
		},
		airline: config.transaction?.airline,
		id: config.transaction?.id,
		mode: config.transaction?.mode
	}
	return mappedAuth
}
