import React, { memo } from 'react'

import Wrapper from '../../container'
import { useTheme } from '../../../../hooks'
import styles from './Error.module.css'
import { Opacity } from '../../../Animation'

interface ErrorProps {
	text: string
}
const Error: React.FC<ErrorProps> = ({ text }) => {
	const { theme, getColorProperty, getFontFormat } = useTheme()

	return (
		<Wrapper
			style={{
				background: getColorProperty(theme.Hints.Error.backgroundColor),
				color: getColorProperty(theme.Hints.Error.textColor),
				font: getFontFormat(theme.Hints.Error.textFont),
				paddingTop: 15,
				paddingBottom: 15,
				backdropFilter: 'blur(5px)'
			}}
		>
			<section className={styles['container']}>
				<Opacity key={'opacity-item'}>{text}</Opacity>
			</section>
		</Wrapper>
	)
}

Error.displayName = 'Error'
export default memo(Error)
