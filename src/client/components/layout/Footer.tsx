import React, { memo } from 'react'
import { useSelector } from 'react-redux'
import Error from './footer/Error'
import SaveCard from './footer/SaveCard'

import { getConfig } from '../../features/configSlice'
import styles from './Footer.module.css'
import { useTheme } from '../../hooks'

interface FooterProps {
	isError: boolean
	errorText?: string | null
	style?: React.CSSProperties
	scStyle?: React.CSSProperties
	tinyScreen?: boolean
}
const Footer: React.FC<FooterProps> = ({
	isError = false,
	errorText = 'Please enter a valid value',
	style,
	scStyle,
	tinyScreen
}: Readonly<FooterProps>) => {
	const { config } = useSelector(getConfig)
	const { theme, getColorProperty } = useTheme()

	const saveCardOption = config.paymentOptions?.saveCardOption ? config.paymentOptions?.saveCardOption : 'all'

	return (
		<footer className={styles['footer']} style={{ ...style }}>
			{isError ? (
				<Error text={errorText ? errorText : `Please enter a valid value`} />
			) : (
				<div style={{ paddingInline: tinyScreen ? 8 : 21, width: '100%' }}>
					<div
						style={{
							width: '100%',
							color: getColorProperty(theme.inlineCard.textFields.textColor)
						}}
					>
						{(saveCardOption === 'all' || saveCardOption === 'merchant') && <SaveCard style={scStyle} />}
					</div>
				</div>
			)}
		</footer>
	)
}

Footer.displayName = 'Footer'
export default memo(Footer)
