import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../app/store'
import { BinTypeI } from '@shared/types/BinTypeI'
import { CreditCardType } from 'credit-card-type/dist/types'
import { removeWhitespaces } from '@utils'

export interface CardSliceState {
	value: string
	trimmedValue: string
	isValid: boolean
	isUserDoneTyping: boolean
	errorText: string
	isPotentiallyValid: boolean
	mode: 'left' | 'right'
	type: CreditCardType | null
	loadedCardType: string | null
	BIN: BinTypeI | null
	BIN_LOCKED: boolean
	isInEnglish: boolean
}

const initialState: CardSliceState = {
	value: '',
	trimmedValue: '',
	isValid: false,
	isPotentiallyValid: false,
	isUserDoneTyping: false,
	errorText: 'Please enter a valid card number',
	mode: 'right',
	type: null,
	loadedCardType: null,
	BIN: null,
	BIN_LOCKED: false,
	isInEnglish: true
}

export const cardSlice = createSlice({
	name: 'card',
	// `createSlice` will infer the state type from the `initialState` argument
	initialState,
	reducers: {
		setCardValue: (state, action: PayloadAction<string>) => {
			if (action.payload === '') {
				state.isValid = false
				state.isPotentiallyValid = false
				state.isUserDoneTyping = false
			}
			state.value = action.payload
			state.trimmedValue = removeWhitespaces(action.payload)
		},
		setType: (state, action: PayloadAction<Pick<CardSliceState, 'type' | 'isValid' | 'isPotentiallyValid'>>) => {
			state.type = action.payload.type
			state.isValid = action.payload.isValid
			state.isPotentiallyValid = action.payload.isPotentiallyValid
		},
		setTypeSavedCard: (state, action: PayloadAction<string | null>) => {
			state.loadedCardType = action.payload
			// state.isValid = action.payload.isValid;
			// state.isPotentiallyValid = action.payload.isPotentiallyValid;
		},
		setIsUserDoneTyping: (state, action: PayloadAction<boolean>) => {
			state.isUserDoneTyping = action.payload
		},
		setIsValid: (state, action: PayloadAction<boolean>) => {
			state.isValid = action.payload
			state.isUserDoneTyping = true
		},
		setIsPotentiallyValid: (state, action: PayloadAction<boolean>) => {
			state.isPotentiallyValid = action.payload
		},
		setErrorText: (state, action: PayloadAction<string>) => {
			state.errorText = action.payload
		},
		setBIN: (state, action: PayloadAction<BinTypeI>) => {
			state.BIN = action.payload
		},
		setMode: (state, action: PayloadAction<'left' | 'right'>) => {
			state.mode = action.payload
		},
		setBIN_LOCKED: (state, action: PayloadAction<boolean>) => {
			state.BIN_LOCKED = action.payload
		},
		setIsInEnglish: (state, action: PayloadAction<boolean>) => {
			state.isInEnglish = action.payload
		},
		resetCard: (state) => ({
			...initialState,
			isInEnglish: state.isInEnglish
		})
	}
})

export const {
	setCardValue,
	setType,
	setTypeSavedCard,
	setIsUserDoneTyping,
	setIsValid,
	setIsPotentiallyValid,
	setErrorText,
	setMode,
	setBIN,
	setBIN_LOCKED,
	setIsInEnglish,
	resetCard
} = cardSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const getCard = (state: RootState) => state.card
export const getExactCardValue = (state: RootState) => state.card.trimmedValue
export const getType = (state: RootState) => state.card.type
export const getValid = (state: RootState) => state.card.isValid
export const getBIN = (state: RootState) => state.card.BIN
export const getPotentiallyValid = (state: RootState) => state.card.isPotentiallyValid
export const getIsComplete = (state: RootState) => state.card.isUserDoneTyping
export const getMode = (state: RootState) => state.card.mode
export const getBIN_LOCKED = (state: RootState) => state.card.BIN_LOCKED

export default cardSlice.reducer
