import { useDispatch } from 'react-redux'
import { setDateValid, setDateValue, setIsUserDoneTyping, setPrevDateValue } from '../features/dateSlice'
import { allCharsInEN, isFuture, removeWhitespaces } from '../utils'
import { setIsInEnglish } from '../features/cardSlice'

export const useExpiryDate = () => {
	const mask = '99/99'
	const dispatch = useDispatch()

	const onChangeExpiryDate = async (value: string) => {
		const changedValue = removeWhitespaces(value)

		if (changedValue) dispatch(setIsInEnglish(allCharsInEN(changedValue?.replace(/\//, ''))))

		// remove / from the value
		const isValueExceedingMask = changedValue.length > mask.length
		// and check if the value is exceeding the mask length.
		// to prevent the user from entering more than the mask length.
		if (isValueExceedingMask) return false

		// see if user is done typing
		const isUserDoneTyping = changedValue.length === mask.length
		dispatch(setIsUserDoneTyping(isUserDoneTyping))
		// reset the date valid state.
		dispatch(setDateValid(false))

		dispatch(setDateValue(changedValue))
		dispatch(setPrevDateValue(changedValue))
		const { isDateInTheFuture } = isFuture(changedValue)

		if (isDateInTheFuture) {
			dispatch(setDateValid(true))
		} else {
			dispatch(setDateValid(false))
		}
	}

	return {
		onChangeExpiryDate
	}
}
