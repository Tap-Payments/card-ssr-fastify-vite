import React from 'react'
import { App } from '../components/app'
import type { configProps } from '@shared/types/configProps'
import type { Card } from '@shared/types/Card'
import type { PaymentOption } from '@shared/types/paymentOption'

import '../i18n'
import '../icons.css'
import '../index.css'

type AppProps = {
	defaultCardConfiguration: Record<string, string>
}
//
const Card = (props: AppProps) => {
	const {
		encryption_key,
		payment_options,
		cards,
		config,
		referer,
		merchantAssets,
		error,
		integration,
		session,
		permission,
		isNewConfig
	} = props.defaultCardConfiguration

	const errorData = error ? JSON.parse(error) : null
	const cardsValue = cards ? (JSON.parse(cards) as Array<Card>) : []
	const paymentOptionsValue = payment_options ? (JSON.parse(payment_options) as Array<PaymentOption>) : []
	const configValue = config ? (JSON.parse(config) as configProps) : null
	const merchantAssetsValue = merchantAssets ? JSON.parse(merchantAssets) : null
	const integrationModeValue = integration ? JSON.parse(integration) : null
	const sessionValue = session ? JSON.parse(session) : null
	const permissionValue = permission ? JSON.parse(permission) : null
	const isNewConfigValue = isNewConfig ? JSON.parse(isNewConfig) : null
	return (
		<React.StrictMode>
			<App
				errorData={errorData}
				referer={referer}
				configValue={configValue}
				encryptionKey={encryption_key}
				paymentOptions={paymentOptionsValue}
				cards={cardsValue}
				themeMode={configValue?.themeMode}
				assets={merchantAssetsValue}
				integrationMode={integrationModeValue}
				session={sessionValue}
				permission={permissionValue}
				isNewConfig={isNewConfigValue}
			/>
		</React.StrictMode>
	)
}

export default Card
