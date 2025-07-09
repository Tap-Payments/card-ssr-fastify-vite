import React, { ElementRef, useCallback, useEffect, useLayoutEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { getCVV } from '../../../features/cvvSlice'
import { changeHolderNameValue, getHolderName, setIsInEnglish } from '../../../features/holdernameSlice'
import { getCard } from '../../../features/cardSlice'
import CancelIcon from '../../icons/CancelIcon'
import { getConfig } from '../../../features/configSlice'
import styles from './CardHolderName.module.css'
import { useTheme } from '../../../hooks'
import { getGlobalState } from '../../../features/globalSlice'
import { allCharsInEN, isValidHolderName, removeNonHolderNameChars, removeWhitespaces } from '../../../utils'

const CardHolderName = () => {
	const dispatch = useDispatch()
	const { t } = useTranslation()
	const cardholderRef = useRef<ElementRef<'input'>>(null)
	const { isValid: cvvValid } = useSelector(getCVV)
	const {
		config: { paymentOptions }
	} = useSelector(getConfig)

	const editable = paymentOptions?.cardNameEditable === true || (paymentOptions?.preLoadCardName?.length || 0) < 4
	const { isValid: cardValid, isUserDoneTyping: cardComplete, mode: formMode } = useSelector(getCard)
	const { loading } = useSelector(getGlobalState)

	const { value: cardholderNameValue } = useSelector(getHolderName)
	const { theme, getColorProperty, getFontFormat } = useTheme()
	const validCardHolderName = removeNonHolderNameChars(cardholderNameValue).toUpperCase()

	const onChangeHandler = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const fieldValue = event.target.value
			if (fieldValue)
				dispatch(setIsInEnglish(allCharsInEN(removeWhitespaces(fieldValue)) || isValidHolderName(fieldValue)))

			const value = removeNonHolderNameChars(fieldValue).toUpperCase()
			dispatch(changeHolderNameValue(value))
			const nativeEvent = event.nativeEvent as InputEvent

			if (nativeEvent.inputType === 'deleteContentBackward' && value === '') {
				const prevSibling = cardholderRef.current?.parentElement?.previousElementSibling?.childNodes[1]
					.lastChild as HTMLElement | null
				prevSibling?.focus?.()
			}
		},
		[dispatch]
	)

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter' || event.keyCode === 13) {
			if (cardholderRef.current) cardholderRef.current.blur()
		}
	}

	const clearHolderName = useCallback(() => {
		dispatch(changeHolderNameValue(''))
	}, [dispatch])

	useLayoutEffect(() => {
		const timer = setTimeout(() => {
			cardholderRef.current?.focus?.()
		}, 500)
		return () => clearTimeout(timer)
	}, [])

	useEffect(() => {
		if (loading) cardholderRef.current?.blur?.()
	}, [loading])

	const validClassName = (cvvValid && cardValid && cardComplete) || formMode === 'right' ? `${styles.valid}` : ''

	return (
		<>
			<input
				key={'cardHolderName_input'}
				maxLength={24}
				ref={cardholderRef}
				value={validCardHolderName}
				onChange={onChangeHandler}
				onKeyDown={handleKeyDown}
				onClickCapture={() => console.info('click captured')}
				onChangeCapture={onChangeHandler}
				type='text'
				id='cardHolderName_input'
				name='cardHolderName_input'
				inputMode='text'
				autoComplete={'cc-name'}
				placeholder={t('TapCardInputKit.cardNamePlaceHolderThree') as string}
				readOnly={!editable}
				className={`${styles['cardinput_class']} ${validClassName}`}
				style={{
					maxHeight: 48,
					backgroundColor: getColorProperty(theme.inlineCard.commonAttributes.backgroundColor),
					color: getColorProperty(theme.inlineCard.textFields.textColor),
					font: getFontFormat(theme.inlineCard.textFields.font)
				}}
			/>
			{validCardHolderName && editable && (
				<button className={styles['cancel_button']} onClick={clearHolderName} key='cancel_button'>
					<CancelIcon />
				</button>
			)}
		</>
	)
}

export default React.memo(CardHolderName)
