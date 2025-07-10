import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../app/store'
import { removeWhitespaces } from '@utils'

export interface HolderNameState {
	value: string
	trimmedValue: string
	isValid: boolean
	isUserDoneTyping: boolean
	errorText: string
	isInEnglish: boolean
}

const initialState: HolderNameState = {
	value: '',
	trimmedValue: '',
	isValid: false,
	isUserDoneTyping: false,
	errorText: 'Please enter a valid card holder name',
	isInEnglish: true
}

export const holdernameSlice = createSlice({
	name: 'holdername',
	// `createSlice` will infer the state type from the `initialState` argument
	initialState,
	reducers: {
		changeHolderNameValue: (state, action: PayloadAction<string>) => {
			if (action.payload === '') {
				state.isValid = false
			}
			state.value = action.payload
			state.trimmedValue = removeWhitespaces(action.payload)
			if (state.trimmedValue.length >= 3) {
				state.isValid = true
				state.isUserDoneTyping = true
			} else {
				state.isValid = false
				state.isUserDoneTyping = false
			}
		},
		setIsUserDoneTyping: (state, action: PayloadAction<boolean>) => {
			state.isUserDoneTyping = action.payload
		},
		setIsInEnglish: (state, action: PayloadAction<boolean>) => {
			state.isInEnglish = action.payload
		},
		resetHolderNameValue: (state) =>
			({
				...initialState,
				isInEnglish: state.isInEnglish
			}) as HolderNameState
	}
})

export const { changeHolderNameValue, setIsUserDoneTyping, resetHolderNameValue, setIsInEnglish } =
	holdernameSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const getHolderName = (state: RootState) => state.holdername

export default holdernameSlice.reducer
