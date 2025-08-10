import React, { memo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useTheme } from '@hooks/useTheme'
import { useErrors } from '@hooks/useErrors'
import { getConfig } from '@features/configSlice'

import styles from './ToolTip.module.css'

interface ToolTipProps {
	show: boolean
}
const ToolTip: React.FC<ToolTipProps> = ({ show }) => {
	const { t } = useTranslation()
	const { config } = useSelector(getConfig)
	const { isShowCollectHolderName } = useErrors()
	const saveCardOption = config.paymentOptions?.saveCardOption
	const { isDark, themeMode, getColorProperty, getFontFormat, theme } = useTheme()

	const tooltipHeight = () => {
		if (isShowCollectHolderName) {
			return saveCardOption === 'tap' ? 80 : 'auto'
		} else {
			return saveCardOption === 'tap' ? 50 : 80
		}
	}

	return (
		<AnimatePresence initial={false} key='AnimatePresence-footer_tooltip'>
			{show && (
				<motion.section
					id={'footer_tooltip'}
					key='footer_tooltip'
					className={`${styles['container']} ${styles[themeMode]}`}
					animate={{ opacity: 1, transition: { duration: 0.5 } }}
					exit={{ opacity: 0 }}
					initial={{ opacity: 0 }}
					style={{
						backgroundColor: isDark ? 'rgba(0, 0, 0, 0.87)' : 'rgba(255, 255, 255, 0.9)',
						color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(75, 72, 71, 0.93)'
					}}
				>
					<div
						className={`${styles['foreground']}`}
						style={{
							overflow: 'auto',
							height: tooltipHeight()
						}}
					>
						<div
							className={`${styles['title']}`}
							style={{
								color: getColorProperty(theme.inlineCard.saveCardForTapOption.tooltip.titleColor),
								font: getFontFormat(theme.inlineCard.saveCardForTapOption.tooltip.titleFont)
							}}
						>
							{t('TapCardInputKit.cardSaveForTapInfoTitle')}
						</div>
						<div
							className={`${styles['content']}`}
							style={{
								color: getColorProperty(theme.inlineCard.saveCardForTapOption.tooltip.subTitleColor),
								font: getFontFormat(theme.inlineCard.saveCardForTapOption.tooltip.subTitleFont)
							}}
						>
							{t('TapCardInputKit.cardSaveForTapInfoMessage')}
						</div>
					</div>
				</motion.section>
			)}
		</AnimatePresence>
	)
}

export default memo(ToolTip)
