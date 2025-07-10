import React, { type KeyboardEvent, useState, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { useMask, format } from '@react-input/mask'

import { getCVV, setCvvIsValid, setCvvErrorText, setIsUserDoneTyping } from '@features/cvvSlice'
import { getCard, setMode } from '@features/cardSlice'
import { maskStringFromNumber } from '@utils'
import { getGlobalState } from '@features/globalSlice'
import CvvIcon from '../../icons/CvvIcon'
import { getDate } from '@features/dateSlice'
import { useTheme } from '@hooks/useTheme'
import { useLocale } from '@hooks/useLocale'
import { useCvv } from '@hooks/useCvv'
import { useInputStyle } from '@hooks/useInputStyle'
import { getConfig } from '@features/configSlice'

import styles from './Cvv.module.css'

const Cvv = ({ tinyScreen, hideTranslate }: { tinyScreen: boolean; hideTranslate: boolean }) => {
	const dispatch = useDispatch()
	const { t } = useTranslation()
	const { value: cvvValue, size } = useSelector(getCVV)
	const mask = maskStringFromNumber(size)
	const { globalMode, loadedCard } = useSelector(getGlobalState)
	const { mode: formMode, isValid: cardValid } = useSelector(getCard)
	const [isCvvFocused, setIsCvvFocused] = useState<boolean>(false)
	const { isValid: dateIsValid } = useSelector(getDate)
	const { direction } = useLocale()
	const { themeMode } = useTheme()
	const style = useInputStyle()
	const { onChangeCvv } = useCvv()
	const { cardCVV, savedCardCVV } = useSelector(getConfig)

	const maskOptions = useMemo(
		() => ({
			mask,
			replacement: { _: /\d/ }
		}),
		[mask]
	)
	const formattedCvvValue = useMemo(() => format(cvvValue || '', maskOptions), [maskOptions, cvvValue])
	const cvvRef = useMask(maskOptions)

	useEffect(() => {
		if (loadedCard) {
			if (savedCardCVV) {
				setIsCvvFocused(true)
				cvvRef.current?.focus()
			} else {
				dispatch(setCvvIsValid(true))
			}
		}
	}, [loadedCard, savedCardCVV])

	useEffect(() => {
		if (dateIsValid) {
			if (cardCVV) {
				setIsCvvFocused(true)
				cvvRef.current?.focus()
			} else {
				dispatch(setCvvIsValid(true))
			}
		}
	}, [dateIsValid, cardCVV])

	const handleOnBlur = (event: React.FocusEvent<HTMLInputElement>) => {
		event.preventDefault()
		if (cvvValue.length === 0) {
			dispatch(setCvvIsValid(false))
			dispatch(setIsUserDoneTyping(false))
			dispatch(setCvvErrorText(''))
			return
		}
		cvvValue.length === size && setIsCvvFocused(false)
		const isLoadedCard = Boolean(loadedCard)
		if (!isLoadedCard && cvvValue.length < size) {
			dispatch(setCvvIsValid(false))
			dispatch(setIsUserDoneTyping(true))
			dispatch(setCvvErrorText(t('Hints.Warning.missingCVV').replace('%i', size.toString())))
		}
	}

	const clickHandler = () => {
		if (!cardValid && globalMode !== 'CreateTokenSavedCard') dispatch(setMode('left'))
	}
	const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value
		onChangeCvv(value)
		const nativeEvent = event.nativeEvent as InputEvent

		if (nativeEvent.inputType === 'deleteContentBackward' && value === '') {
			const prevSibling = cvvRef.current?.previousElementSibling as HTMLElement
			prevSibling?.focus()
		}
		//dispatch(setIsValid(card))
	}
	const backkey = (event: KeyboardEvent) => {
		const key = event.key || event.keyCode
		if (key === 8) {
			if (cvvValue.length === 0) {
				const prevSibling = cvvRef.current?.previousElementSibling as HTMLElement
				prevSibling?.focus()
			}
		}
	}

	const validClassName = formMode === 'right' ? `${styles['show_right']}` : ''

	return (
		<div
			key='cvv_input-div'
			className={`${styles[themeMode]} ${styles['cvv_input']} ${
				!!loadedCard && isCvvFocused ? styles['loadedCard'] : ''
			} ${(!savedCardCVV && loadedCard) || (!cardCVV && !loadedCard) ? styles['hide_cvv_input'] : ''} `}
			style={{
				...(tinyScreen && {
					flex: 1
				})
			}}
		>
			<input
				value={formattedCvvValue}
				ref={cvvRef}
				dir={direction}
				id='cvv_input'
				name='cvv_input'
				inputMode='numeric'
				onKeyDown={backkey}
				type='password'
				onClickCapture={clickHandler}
				className={`${styles['cardinput_class']} ${styles['date_input']} ${validClassName}`}
				placeholder={
					(hideTranslate
						? t('TapCardInputKit.cardCVVPlaceHolderShort')
						: t('TapCardInputKit.cardCVVPlaceHolder')) as string
				}
				autoComplete={'cc-csc'}
				readOnly={!cardValid && globalMode !== 'CreateTokenSavedCard'}
				onChange={onChangeHandler}
				onFocus={() => setIsCvvFocused(true)}
				onBlur={handleOnBlur}
				style={{
					...style,
					...(tinyScreen && {
						width: 30
					}),
					font: cvvValue.length ? 'caption' : style.font
				}}
			/>
			<AnimatePresence initial={false}>
				{!!loadedCard && isCvvFocused && (
					<motion.div key='cvv-icon' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
						<CvvIcon />
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}

export default React.memo(Cvv)
