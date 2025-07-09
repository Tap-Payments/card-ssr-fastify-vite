import React, { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { setMode, getCard } from '../../../features/cardSlice'
import styles from './MinCard.module.css'
import { getGlobalState } from '../../../features/globalSlice'
import { useLocale } from '../../../hooks'
import { useInputStyle } from '../../../hooks/useInputStyle'
import { useCardNumber } from '../../../hooks/useCardNumber'
import { useMask, format } from '@react-input/mask'

const MinCard = ({ tinyScreen }: { tinyScreen: boolean }) => {
	const dispatch = useDispatch()
	const { t } = useTranslation()
	const { globalMode, loadedCard } = useSelector(getGlobalState)
	const { trimmedValue: exactcardValue, mode: formMode } = useSelector(getCard)
	const { placeholder } = useCardNumber()
	const { direction } = useLocale()
	const style = useInputStyle()

	const type_card = /^3[47]/.test(exactcardValue) ? 'amex' : 'noneamex'
	const mask = useMemo(() => (type_card === 'amex' ? '••••_____' : '••••____'), [type_card])

	let cardend = ''
	if (globalMode !== 'CreateTokenSavedCard') {
		cardend =
			type_card === 'amex'
				? exactcardValue.substring(exactcardValue.length - 5)
				: exactcardValue.substring(exactcardValue.length - 4)
	} else {
		cardend = loadedCard?.last_four !== undefined ? loadedCard?.last_four : ''
	}

	const maskOptions = useMemo(
		() => ({
			mask,
			replacement: { _: /\d/ }
		}),
		[mask]
	)
	const formattedCardend = format(cardend || '', maskOptions)
	const miniCardRef = useMask(maskOptions)

	const switchToLeft = () => {
		if (globalMode !== 'CreateTokenSavedCard') dispatch(setMode('left'))
	}

	const validClassName = formMode === 'right' ? `${styles['show_right']}` : ''

	return (
		<input
			id='card_input_mini'
			dir={direction}
			value={formattedCardend}
			ref={miniCardRef}
			type={'tel'}
			name='card_input_mini'
			autoComplete={'cc-number'}
			placeholder={placeholder}
			onClick={switchToLeft}
			onFocus={switchToLeft}
			readOnly={!!loadedCard}
			className={`${styles['cardinput_class']} ${styles['date_input']} ${validClassName}`}
			style={{
				...style,
				...(tinyScreen && {
					width: 90
				})
			}}
		/>
	)
}

export default React.memo(MinCard)
