import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import CheckBox from '../../../icons/CheckBox'
import styles from './SaveCard.module.css'
import { useLocale, useTheme } from '../../../../hooks'
import { useDispatch, useSelector } from 'react-redux'

import { getConfig } from '../../../../features/configSlice'
import { sendEventGeneric } from '../../../../utils'
import { getGlobalState, toggleSaveCardForLater } from '../../../../features/globalSlice'
import { Opacity } from '../../../Animation'

interface SaveCardProps {
	style?: React.CSSProperties
}
const SaveCard: React.FC<SaveCardProps> = ({ style }) => {
	const { t } = useTranslation()
	const { theme, getColorProperty, isLight, getFontFormat } = useTheme()
	const { refererUrl } = useSelector(getConfig)
	const { isRTL } = useLocale()
	const dispatch = useDispatch()
	const { saveCardForLater } = useSelector(getGlobalState)

	const toggleHandler = (e: any) => {
		dispatch(toggleSaveCardForLater())
		sendEventGeneric(refererUrl, {
			event: 'saveCardForLater',
			data: { saveCardForLater: !saveCardForLater }
		})
	}

	return (
		<div
			key='save-card'
			className={styles['container']}
			style={{
				color: getColorProperty(theme.inlineCard.textFields.textColor),
				...style
			}}
		>
			<Opacity key={'opacity-item1'}>
				<span
					className={styles['text']}
					style={{
						color: getColorProperty(theme.inlineCard.textFields.textColor),
						font: getFontFormat(theme.inlineCard.textFields.font)
					}}
				>
					{t('TapCardInputKit.cardSaveLabel')}
				</span>
			</Opacity>
			<Opacity key={'opacity-item2'}>
				<CheckBox
					isOn={saveCardForLater}
					handleToggle={toggleHandler}
					onColor='#34C759'
					offColor={isLight ? 'rgba(120, 120, 128, 0.16)' : '#4B4847'}
					style={{
						transform: isRTL ? 'rotate(180deg)' : 'rotate(0deg)'
					}}
				/>
			</Opacity>
		</div>
	)
}

export default memo(SaveCard)
