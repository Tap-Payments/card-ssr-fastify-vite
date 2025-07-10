import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../app/store'
import { CreditCardTypeSecurityCodeLabel } from '@shared/types/cardtypeI'

interface PrevCvvState {
	value: string
	isValid: boolean
	isUserDoneTyping: boolean
}

export interface CVVState {
	size: number
	label: CreditCardTypeSecurityCodeLabel
	value: string
	isValid: boolean
	isUserDoneTyping: boolean
	errorText: string
	prevState: PrevCvvState
}

const initialState: CVVState = {
	size: 3,
	label: 'CVV',
	value: '',
	isValid: false,
	isUserDoneTyping: false,
	errorText: 'Please enter a valid card CVV',
	prevState: {
		value: '',
		isValid: false,
		isUserDoneTyping: false
	}
}

export const cvvSlice = createSlice({
	name: 'cvv',
	// `createSlice` will infer the state type from the `initialState` argument
	initialState,
	reducers: {
		setCvvValue: (state, action: PayloadAction<string>) => {
			if (action.payload === '') {
				state.isValid = false
				state.isUserDoneTyping = false
			}
			state.value = action.payload
		},
		setPrevCvvState: (state, action: PayloadAction<PrevCvvState>) => {
			state.prevState.value = action.payload.value
			state.prevState.isUserDoneTyping = action.payload.isUserDoneTyping
			state.prevState.isValid = action.payload.isValid
		},
		recoverLatestCvv: (state) => {
			state.value = state.prevState.value
			state.isValid = state.prevState.isValid
			state.isUserDoneTyping = state.prevState.isUserDoneTyping
		},
		setCvvLabelAndSize: (state, action: PayloadAction<{ label: CreditCardTypeSecurityCodeLabel; size: number }>) => {
			state.size = action.payload.size
			state.label = action.payload.label
			// also set the error text to match the label,
			// example: 'CVV' | 'CVC' ...CreditCardTypeSecurityCodeLabel.
			state.errorText = `Please enter a valid ${action.payload.label}`
		},
		setCvvSize: (state, action: PayloadAction<{ size: number }>) => {
			state.size = action.payload.size
		},

		setIsUserDoneTyping: (state, action: PayloadAction<boolean>) => {
			state.isUserDoneTyping = action.payload
		},
		setCvvIsValid: (state, action: PayloadAction<boolean>) => {
			state.isValid = action.payload
		},
		setCvvErrorText: (state, action: PayloadAction<string>) => {
			state.errorText = action.payload
		},
		resetCVV: () => initialState
	}
})

export const {
	setCvvValue,
	recoverLatestCvv,
	setCvvLabelAndSize,
	setCvvSize,
	setCvvIsValid,
	setIsUserDoneTyping,
	setCvvErrorText,
	resetCVV,
	setPrevCvvState
} = cvvSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const getCVV = (state: RootState) => state.cvv

export default cvvSlice.reducer
