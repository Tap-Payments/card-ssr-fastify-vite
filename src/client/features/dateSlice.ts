import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../app/store";

export interface DateSliceState {
  value: string;
  prevValue: string;
  isValid: boolean;
  isUserDoneTyping: boolean;
  errorText: string;
}

const initialState: DateSliceState = {
  value: "",
  prevValue: "",
  isValid: false,
  isUserDoneTyping: false,
  errorText: "Please enter a valid card date",
};

export const dateSlice = createSlice({
  name: "date",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setDateValue: (state, action: PayloadAction<string>) => {
      if (action.payload === "") {
        state.isValid = false;
        state.isUserDoneTyping = false;
      }
      state.value = action.payload;
    },
    setPrevDateValue: (state, action: PayloadAction<string>) => {
      state.prevValue = action.payload;
    },
    setDateValid: (state, action: PayloadAction<boolean>) => {
      state.isValid = action.payload;
    },
    setIsUserDoneTyping: (state, action: PayloadAction<boolean>) => {
      state.isUserDoneTyping = action.payload;
    },
    setDateErrorText: (state, action: PayloadAction<string>) => {
      state.errorText = action.payload;
    },
    resetDate: () => initialState,
  },
});

export const {
  setDateValue,
  setPrevDateValue,
  setDateValid,
  setIsUserDoneTyping,
  setDateErrorText,
  resetDate,
} = dateSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const getDate = (state: RootState) => state.date;

export default dateSlice.reducer;
