/* eslint-disable import/no-named-as-default */
import { configureStore } from "@reduxjs/toolkit";
import {
  useDispatch,
  type TypedUseSelectorHook,
  useSelector as useReduxSelector,
} from "react-redux";

// reducers
import globalSlice from "../features/globalSlice";
import cardSlice from "../features/cardSlice";
import dateSlice from "../features/dateSlice";
import cvvSlice from "../features/cvvSlice";
import configSlice from "../features/configSlice";
import errorSlice from "../features/errorSlice";
import holdernameSlice from "../features/holdernameSlice";
import authenticationSlice from "../features/authenticationSlice";
// import usersReducer from '../features/users/usersSlice'

export const store: any = configureStore({
  reducer: {
    card: cardSlice,
    date: dateSlice,
    cvv: cvvSlice,
    error: errorSlice,
    config: configSlice,
    global: globalSlice,
    holdername: holdernameSlice,
    authentication: authenticationSlice,
  },
  // prevent devTools in production
  devTools: process.env.NODE_ENV !== "production",
  //  enable trace if not enabled.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

// Export a hook that can be reused to resolve types
export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useAppSelector: TypedUseSelectorHook<RootState> = useReduxSelector;
