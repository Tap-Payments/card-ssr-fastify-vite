import React, { type FC } from 'react'
import { useTheme } from '../../../hooks/useTheme'
import styles from './Separator.module.css'

const Separator: FC = () => {
	const { theme, getColorProperty } = useTheme()

	return (
		<span
			data-testid='Separator'
			className={styles.separator}
			style={{
				background: getColorProperty(theme.Click2Pay?.Separator?.backgroundColor)
			}}
		/>
	)
}

Separator.displayName = 'Separator'
export default React.memo(Separator)
