import React, { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useMask, format } from '@react-input/mask'

import { setDateValid, getDate, setIsUserDoneTyping } from '@features/dateSlice'
import { getCard, setMode } from '@features/cardSlice'
import { isFuture, sendEventGeneric } from '@utils'
import { getConfig } from '@features/configSlice'
import { getGlobalState } from '@features/globalSlice'
import { useLocale } from '@hooks/useLocale'
import { useExpiryDate } from '@hooks/useExpiryDate'
import { useInputStyle } from '@hooks/useInputStyle'

import styles from './ExpiryDate.module.css'

interface InputState {
	value: string
	selection: Selection | null
}
const ExpiryDate = ({ tinyScreen }: { tinyScreen: boolean }) => {
	const mask = '__/__'
	const dispatch = useDispatch()
	const { t } = useTranslation()
	const { value: dateValue, isValid: dateValid } = useSelector(getDate)
	const { isValid: cardValid, isUserDoneTyping: cardComplete, mode: formMode } = useSelector(getCard)
	const { globalMode } = useSelector(getGlobalState)
	const { refererUrl: url } = useSelector(getConfig)
	const { direction } = useLocale()
	const style = useInputStyle()
	const { onChangeExpiryDate } = useExpiryDate()

	const maskOptions = useMemo(
		() => ({
			mask,
			replacement: { _: /\d/ }
		}),
		[mask]
	)
	const formattedDateValue = useMemo(() => format(dateValue || '', maskOptions), [maskOptions, dateValue])
	const expiryDateRef = useMask(maskOptions)

	const validate = () => {
		if (dateValue.length === 5) {
			const { isDateInTheFuture } = isFuture(dateValue)
			const eventData = {
				date: {
					isValid: dateValid,
					isUserDoneTyping: dateValue.length === 5,
					errorMessage: ''
				}
			}

			if (isDateInTheFuture === false) {
				eventData.date.errorMessage = 'Invalid Card Number'
			} else {
				eventData.date.errorMessage = ''
			}
			return sendEventGeneric(url, { event: 'cardInputs', data: eventData })
		}
	}
	const clickHandler = () => {
		if (!cardValid && globalMode !== 'CreateTokenSavedCard') dispatch(setMode('left'))
	}

	const moveCursorEnd = () => {
		if (expiryDateRef === null || expiryDateRef.current === null) return
		expiryDateRef.current.selectionStart = expiryDateRef.current.value.length
		expiryDateRef.current.selectionEnd = expiryDateRef.current.value.length
	}
	const doMaskingForMonths = (value: string) => {
		let newValue = value
		if (value.length === 1 && parseInt(value) > 1) {
			newValue = `0${value}/`
			setTimeout(moveCursorEnd, 100)
		}
		return newValue
	}

	const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		const changedValue = doMaskingForMonths(event.target.value)
		onChangeExpiryDate(changedValue)
	}

	// focus on expiry date input if card is valid and complete.
	useEffect(() => {
		if (cardValid === true && cardComplete === true) {
			const setFocus = () => {
				expiryDateRef.current?.focus?.({ preventScroll: true })
				const expireDateInput = document.getElementById('date_input') as HTMLElement | null
				expireDateInput?.focus({ preventScroll: true })
			}
			const timer = setTimeout(setFocus, 10)
			return () => clearTimeout(timer)
		}
	}, [cardValid, cardComplete])

	// move focus to cvv input if date is valid.
	useEffect(() => {
		setTimeout(() => {
			validate()
			if (expiryDateRef.current?.name === 'date_input') {
				// move focus to cvv input if date is valid.
				const cvvInput = expiryDateRef.current.nextElementSibling as HTMLElement
				const { isDateInTheFuture } = isFuture(dateValue)

				if (cvvInput !== null && isDateInTheFuture) {
					// focus if not already focused
					if (document.activeElement !== cvvInput) cvvInput.focus()
				}
			}
		}, 100)
	}, [dateValue])

	const validClassName = formMode === 'right' ? `${styles['show_right']}` : ''
	const inValidClassName =
		dateValue.length === 5 && isFuture(dateValue).isDateInTheFuture === false ? `${styles['input_error']}` : ''

	const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
		event.preventDefault()
		if (dateValue.length === 0) return
		if (cardValid && dateValue.length < 5) {
			dispatch(setDateValid(false))
			dispatch(setIsUserDoneTyping(true))
		}
	}

	return (
		<input
			value={formattedDateValue}
			ref={expiryDateRef}
			dir={direction}
			type='tel'
			id='date_input'
			name='date_input'
			inputMode='numeric'
			placeholder={t('TapCardInputKit.cardExpiryPlaceHolder') as string}
			autoComplete={'cc-exp'}
			readOnly={globalMode === 'CreateTokenSavedCard'}
			className={`${styles['cardinput_class']}  ${styles['date_input']} ${validClassName} ${inValidClassName}`}
			onBlur={handleBlur}
			onClickCapture={clickHandler}
			onChange={onChangeHandler}
			style={{
				...style,
				...(tinyScreen && {
					width: 50
				})
			}}
		/>
	)
}

export default React.memo(ExpiryDate)
