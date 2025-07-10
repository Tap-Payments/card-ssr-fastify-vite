import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../app/store'
import { Card } from '@shared/types/Card'

// create a global state slice for the app that stores Save card for later checkbox state
export interface GlobalState {
	saveCardForLater: boolean
	saveForOtherStores: boolean
	showSaveForOtherStoresToolTip: boolean
	globalMode?: string
	loading: boolean
	loadedCard?: Card | null
	threeDsHeight?: number
	hideCardFor3ds?: boolean
}

const initialState: GlobalState = {
	saveCardForLater: false,
	saveForOtherStores: true,
	showSaveForOtherStoresToolTip: false,
	globalMode: 'createToken',
	loading: false,
	loadedCard: null,
	hideCardFor3ds: false
}

export const globalSlice = createSlice({
	name: 'global',
	// `createSlice` will infer the state type from the `initialState` argument
	initialState,

	reducers: {
		setHideCardFor3ds: (state, action: PayloadAction<boolean>) => {
			state.hideCardFor3ds = action.payload
		},
		setSaveCardForLater: (state, action: PayloadAction<boolean>) => {
			state.saveCardForLater = action.payload
		},
		setThreeDsHeight: (state, action: PayloadAction<number | undefined>) => {
			state.threeDsHeight = action.payload
		},
		setLoadedCard: (state, action: PayloadAction<Card | null>) => {
			state.loadedCard = action.payload
		},
		setGlobalMode: (state, action: PayloadAction<string>) => {
			state.globalMode = action.payload
		},
		toggleSaveCardForLater: (state) => {
			state.saveCardForLater = !state.saveCardForLater
		},
		setSaveForOtherStores: (state, action: PayloadAction<boolean>) => {
			state.saveForOtherStores = action.payload
		},
		toggleSaveForOtherStores: (state) => {
			state.saveForOtherStores = !state.saveForOtherStores
		},
		setShowSaveForOtherStoresToolTip: (state, action: PayloadAction<boolean>) => {
			state.showSaveForOtherStoresToolTip = action.payload
		},
		setLoading: (state, action: PayloadAction<boolean>) => {
			state.loading = action.payload
		},
		toggleShowSaveForOtherStoresToolTip: (state) => {
			state.showSaveForOtherStoresToolTip = !state.showSaveForOtherStoresToolTip
		},
		resetGlobalState: () => initialState
	}
})

export const {
	setSaveCardForLater,
	setSaveForOtherStores,
	setShowSaveForOtherStoresToolTip,
	toggleSaveCardForLater,
	toggleSaveForOtherStores,
	toggleShowSaveForOtherStoresToolTip,
	resetGlobalState,
	setGlobalMode,
	setLoadedCard,
	setLoading,
	setThreeDsHeight,
	setHideCardFor3ds
} = globalSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const getGlobalState = (state: RootState) => state.global

export default globalSlice.reducer
