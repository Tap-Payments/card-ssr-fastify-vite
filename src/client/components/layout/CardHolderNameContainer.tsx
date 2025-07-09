import React, { memo } from 'react'

import { useTheme } from '../../hooks'
import CardHolderName from '../inputs/CardHolderName/CardHolderName'
import styles from './CardHolderNameContainer.module.css'
import Wrapper from './container'

const CardHolderNameContainer = ({ tinyScreen }: { tinyScreen: boolean }) => {
	const { theme, getColorProperty } = useTheme()

	return (
		<div
			key='main-card-container-key'
			id='card-holder-name-container'
			className={styles['main']}
			style={{
				borderTopColor: getColorProperty(theme.tapSeparationLine.backgroundColor)
			}}
		>
			<Wrapper
				className={styles['card-holder-name-wrapper']}
				style={{
					height: 48,
					backgroundColor: getColorProperty(theme.inlineCard.commonAttributes.backgroundColor),
					color: getColorProperty(theme.inlineCard.textFields.textColor),
					...(tinyScreen && {
						padding: 6
					})
				}}
			>
				<CardHolderName />
			</Wrapper>
		</div>
	)
}

export default memo(CardHolderNameContainer)
