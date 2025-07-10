import React, { memo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useClickAway } from 'react-use'
import { useTranslation } from 'react-i18next'
import ToolTip from '../ToolTip'
import CheckMark from '../../../icons/CheckMark'
import ExclamationIcon from '../../../icons/ExclamationIcon'
import {
	getGlobalState,
	toggleSaveForOtherStores,
	setShowSaveForOtherStoresToolTip,
	toggleShowSaveForOtherStoresToolTip
} from '@features/globalSlice'
import { getConfig } from '@features/configSlice'
import { sendEventGeneric } from '@utils'
import { useTheme } from '@hooks/useTheme'

import styles from './SaveForOtherStores.module.css'

interface SaveForOtherStoresProps {
	style?: React.CSSProperties
}
const SaveForOtherStores: React.FC<SaveForOtherStoresProps> = ({ style }) => {
	const dispatch = useDispatch()
	const buttonRef = React.useRef(null)
	const { refererUrl, config } = useSelector(getConfig)
	const { theme, getColorProperty, getFontFormat } = useTheme()
	const { saveForOtherStores, showSaveForOtherStoresToolTip } = useSelector(getGlobalState)
	let saveForOtherStoresInit = saveForOtherStores
	const saveCardOption = config.paymentOptions?.saveCardOption
	const { t } = useTranslation()

	const toggleSaveCard = React.useCallback(() => {
		dispatch(toggleSaveForOtherStores())
		saveForOtherStoresInit = !saveForOtherStoresInit
		sendEventGeneric(refererUrl, {
			event: 'saveCardForLaterTap',
			data: { saveCardForLaterTap: saveForOtherStoresInit }
		})
	}, [])

	const toggleTooltip = React.useCallback(() => {
		dispatch(toggleShowSaveForOtherStoresToolTip())
	}, [])

	// clicking anywhere outside the button will close the tooltip.
	useClickAway(buttonRef, () => {
		dispatch(setShowSaveForOtherStoresToolTip(false))
	})

	return (
		<section
			className={styles['container']}
			style={{
				color: getColorProperty(theme.inlineCard.saveCardForTapOption.labelTextColor),
				font: getFontFormat(theme.inlineCard.saveCardForTapOption.labelTextFont),
				...style
			}}
		>
			<div
				style={{
					width: '100%',
					display: 'flex',
					alignItems: 'center',
					paddingBottom: '10.5px',
					color: getColorProperty(theme.inlineCard.textFields.textColor),
					...(saveCardOption === 'all' && {
						paddingTop: '14.5px',
						borderTop: `1px solid ${getColorProperty(theme.tapSeparationLine.backgroundColor)}`
					})
				}}
			>
				<input
					className={styles['checkbox']}
					id='SaveForOtherStores'
					type='checkbox'
					name={'SaveForOtherStores'}
					defaultChecked={saveForOtherStores}
					// checked={saveForOtherStores}
				/>
				<div
					className={`${styles['checkbox_box']} ${saveForOtherStores ? styles['checked'] : ''}`}
					onClick={toggleSaveCard}
				>
					{saveForOtherStores && <CheckMark type='light' />}
				</div>
				<label
					className={styles['text']}
					htmlFor='SaveForOtherStores'
					onClick={toggleSaveCard}
					style={{
						font: getFontFormat(theme.inlineCard.saveCardForTapOption.labelTextFont),
						color: getColorProperty(theme.inlineCard.saveCardForTapOption.labelTextColor)
					}}
				>
					{t('TapCardInputKit.cardSaveForTapLabel')}
				</label>
				<div className={styles['tooltip']}>
					<button className={styles['button']} ref={buttonRef} onClick={toggleTooltip}>
						<ExclamationIcon width={16} height={16} />
					</button>
					<ToolTip show={showSaveForOtherStoresToolTip} />
				</div>
			</div>
		</section>
	)
}

SaveForOtherStores.displayName = 'SaveForOtherStores'
export default memo(SaveForOtherStores)
