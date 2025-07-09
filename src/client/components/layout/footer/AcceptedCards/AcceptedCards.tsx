import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import PaymentIconsList from '../../../icons/PaymentIconsList'

import { useTheme } from '../../../../hooks'
import { Opacity } from '../../../Animation'
import styles from './AcceptedCards.module.css'
import { Locale, Page_Direction } from '../../../../types'

interface AcceptedCardsProps {
	dir?: string
	lang?: string
	style?: React.CSSProperties
}
const AcceptedCards: React.FC<AcceptedCardsProps> = ({ lang, dir, style }) => {
	const { t } = useTranslation()
	const { theme, getColorProperty, getFontFormat } = useTheme()

	return (
		<section
			key='accepted-cards'
			id='accepted-cards'
			data-testid='AcceptedCards'
			className={styles['container']}
			dir={lang === Locale.ar ? Page_Direction.rtl : Page_Direction.ltr}
			lang={lang}
			style={{
				color: getColorProperty(theme.cardPhoneList.weAcceptLabel.textColor),
				font: getFontFormat(theme.cardPhoneList.weAcceptLabel.textFont),
				...style
			}}
		>
			<Opacity key={'opacity-item'}>
				<p
					className={styles['accept_text']}
					data-testid='weSupport-label'
					style={{
						color: getColorProperty(theme.cardPhoneList.weAcceptLabel.textColor),
						font: getFontFormat(theme.cardPhoneList.weAcceptLabel.textFont)
					}}
				>
					{t('TapCardInputKit.weSupport')}
				</p>
			</Opacity>
			<PaymentIconsList />
		</section>
	)
}
AcceptedCards.displayName = 'AcceptedCards'
export default memo(AcceptedCards)
