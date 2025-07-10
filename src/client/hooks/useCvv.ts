import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import {
	getCVV,
	setCvvErrorText,
	setCvvIsValid,
	setCvvValue,
	setIsUserDoneTyping,
	setPrevCvvState
} from '../features/cvvSlice'
import { getGlobalState } from '@features/globalSlice'
import { setIsInEnglish } from '@features/cardSlice'
import { allCharsInEN } from '@utils'

export const useCvv = () => {
	const { t } = useTranslation()
	const { size } = useSelector(getCVV)
	const { loadedCard } = useSelector(getGlobalState)
	const dispatch = useDispatch()

	const onChangeCvv = async (value: string) => {
		// accept only number
		if (value) dispatch(setIsInEnglish(allCharsInEN(value)))
		if (!value.match(/^[0-9]*$/)) return

		if (value.length === size) {
			dispatch(setCvvIsValid(true))
			dispatch(setCvvValue(value))
			dispatch(setIsUserDoneTyping(true))
			if (!loadedCard) {
				dispatch(setPrevCvvState({ value, isValid: true, isUserDoneTyping: true }))
			}
		}

		if (value.length < size) {
			dispatch(setCvvIsValid(false))
			dispatch(setCvvValue(value))
			dispatch(setIsUserDoneTyping(false))
			if (!loadedCard) {
				dispatch(setPrevCvvState({ value, isValid: false, isUserDoneTyping: false }))
			}
		}

		if (value.length === 0) {
			dispatch(setCvvErrorText(t('Hints.Warning.missingCVV').replace('%i', size.toString())))
			dispatch(setCvvIsValid(false))
			dispatch(setIsUserDoneTyping(true))
			if (!loadedCard) {
				dispatch(setPrevCvvState({ value: '', isValid: false, isUserDoneTyping: true }))
			}
		}
	}

	return {
		onChangeCvv
	}
}
