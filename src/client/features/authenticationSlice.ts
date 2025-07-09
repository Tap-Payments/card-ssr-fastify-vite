import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../app/store'

export interface AuthenticationSliceState {
	authenticationURL?: string
	showAuthenticationIframe: boolean
	finishAuthenticationIframe: boolean
	is3DsActive?: boolean
}

const initialState: AuthenticationSliceState = {
	authenticationURL: undefined,
	showAuthenticationIframe: false,
	finishAuthenticationIframe: false,
	is3DsActive: undefined
}

export const authenticationSlice = createSlice({
	name: 'authentication',
	// `createSlice` will infer the state type from the `initialState` argument
	initialState,
	reducers: {
		setAuthenticationURL: (state, action: PayloadAction<string | undefined>) => {
			state.authenticationURL = action.payload
		},
		setShowAuthenticationIframe: (state, action: PayloadAction<boolean>) => {
			state.showAuthenticationIframe = action.payload
		},
		setFinishAuthenticationIframe: (state, action: PayloadAction<boolean>) => {
			state.finishAuthenticationIframe = action.payload
		},
		setIs3DsActive: (state, action: PayloadAction<boolean | undefined>) => {
			state.is3DsActive = action.payload
		},
		resetAuthentication: () => initialState
	}
})

export const {
	setAuthenticationURL,
	setShowAuthenticationIframe,
	setFinishAuthenticationIframe,
	setIs3DsActive,
	resetAuthentication
} = authenticationSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const getAuthentication = (state: RootState) => state.authentication

export default authenticationSlice.reducer
