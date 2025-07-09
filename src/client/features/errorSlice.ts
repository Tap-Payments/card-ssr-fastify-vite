import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState, store } from '../app/store'

export interface ErrorSliceState {
	errorText: string
	isAnyError: boolean
	isAllInputsValid: boolean
	isHeaderValid: boolean
	isCreditCardError: boolean
	isExpireDateError: boolean
	isCVVError: boolean
	isCardHolderValid: boolean
}

const initialState: ErrorSliceState = {
	errorText: '',
	isAnyError: false,
	isAllInputsValid: false,
	isHeaderValid: false,
	isCreditCardError: false,
	isExpireDateError: false,
	isCVVError: false,
	isCardHolderValid: false
}

export const errorSlice = createSlice({
	name: 'error',
	// `createSlice` will infer the state type from the `initialState` argument
	initialState,
	reducers: {
		setError: (state, action: PayloadAction<string>) => {
			const reduxStore = store.getState()

			state.errorText = reduxStore.card.errorText
		}
	}
})

export const { setError } = errorSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const getError = (state: RootState) => state.error

export default errorSlice.reducer
