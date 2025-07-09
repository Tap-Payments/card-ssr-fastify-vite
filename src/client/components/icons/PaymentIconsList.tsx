import React, { memo } from 'react'
import PaymentIcon from './PaymentIcon'
import styles from './PaymentIconsList.module.css'
import { useTheme } from '../../hooks'
import { useSelector } from 'react-redux'
import { getConfig } from '../../features/configSlice'
import { Integration } from '../../types'

const PaymentIconsList: React.FC = () => {
	const { themeMode } = useTheme()
	const { config, allCards } = useSelector(getConfig)
	return (
		<section data-testid='PaymentIconsList' className={styles['container']} key='payment-icon-container'>
			{allCards.map(({ id, logos, name, isDisabled }, idx) => {
				if (isDisabled && config.integration !== Integration.CHECKOUT) return undefined
				return (
					<React.Fragment key={`${id}-payment-icon`}>
						<PaymentIcon
							key={`${id}-payment-icon`}
							url={isDisabled ? logos[themeMode].disabled.svg : logos[themeMode].svg}
							type={name}
							data-name={name}
							data-disabled={isDisabled}
						/>
					</React.Fragment>
				)
			})}
		</section>
	)
}

PaymentIconsList.displayName = 'PaymentIconsList'
export default memo(PaymentIconsList)
