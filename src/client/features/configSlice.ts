import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../app/store";
import type { Card } from "@shared/types/Card";
import { Scope, ThemeMode } from "@shared/types";
import type { DarkTheme } from "@shared/types/dark";
import type { LightTheme } from "@shared/types/light";
import type { Authentication } from "@shared/types/Authentication";
import type { LocalizationObject } from "@shared/types/localization";
import type {
  Features,
  configPaymentOption,
  configProps,
} from "@shared/types/configProps";
import type {
  CURRENCIES,
  PaymentOption,
  SupportedCards,
} from "@shared/types/paymentOption";
import API from "../api";
import I18n from "../i18n";
import {
  getAcceptedCards,
  getClickToPaySupportedCards,
  getNotAcceptedCards,
} from "../utils/paymentMethod";
import { isSupportedCurrency } from "../utils/paymentMethod/isSupportedCurrency";

interface CardTheme {
  light: LightTheme;
  dark: DarkTheme;
}
interface ConfigSliceProps {
  config: configProps;
  refererUrl: string;
  encryptionKey: string;
  paymentOptions: Array<PaymentOption>;
  cards?: Array<Card>;
  supportedCards: Array<SupportedCards>;
  disabledCards: Array<SupportedCards>;
  allCards: Array<SupportedCards>;
  clickToPaySupportedCards: SupportedCards[];
  languages: LocalizationObject;
  theme: CardTheme;
  themeMode: ThemeMode;
  hideSavedCardForLoading: boolean;
  hideErrorFooter: boolean;
  authentication?: Authentication;
  scope: Scope;
  features: Features;
  powered: boolean;
  ip?: string;
  cardCVV?: boolean;
  savedCardCVV?: boolean;
  clickToPay: {
    enabled: boolean;
    fired: boolean;
    url: string;
  };
}
const initialState: ConfigSliceProps = {
  refererUrl: "",
  config: {} as configProps,
  encryptionKey: "",
  paymentOptions: [],
  allCards: [],
  supportedCards: [],
  disabledCards: [],
  clickToPaySupportedCards: [],
  cards: [],
  languages: {} as LocalizationObject,
  theme: {} as CardTheme,
  themeMode: ThemeMode.LIGHT,
  hideSavedCardForLoading: false,
  hideErrorFooter: false,
  authentication: undefined,
  scope: Scope.TOKEN,
  features: {
    customerCards: {
      saveCard: false,
      autoSaveCard: false,
    },
    alternativeCardInputs: {
      cardScanner: false,
      cardNFC: false,
    },
  },
  powered: true,
  ip: undefined,
  cardCVV: true,
  savedCardCVV: true,
  clickToPay: {
    enabled: false,
    fired: false,
    url: "",
  },
};

export const fetchLocaleAsync = createAsyncThunk(
  "localization/get",
  async (url: string) => {
    const response = await API.appService.getLocale(url);
    return response;
  },
);

export const fetchThemeAsync = createAsyncThunk(
  "theme/get",
  async (Theme: { url: { light: string; dark: string } }) => {
    const { url } = Theme;
    const [dark, light] = await Promise.all([
      API.appService.getTheme(ThemeMode.DARK, url.dark),
      API.appService.getTheme(ThemeMode.LIGHT, url.light),
    ]);
    return {
      theme: { dark, light },
    };
  },
);

export const configSlice = createSlice({
  name: "config",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setHideSavedCardForLoading: (
      state,
      action: PayloadAction<ConfigSliceProps["hideSavedCardForLoading"]>,
    ) => {
      state.hideSavedCardForLoading = action.payload;
    },
    setHideErrorFooter: (
      state,
      action: PayloadAction<ConfigSliceProps["hideErrorFooter"]>,
    ) => {
      state.hideErrorFooter = action.payload;
    },
    setConfig: (state, action: PayloadAction<ConfigSliceProps["config"]>) => {
      state.config = action.payload;
    },
    setPublicKey: (state, action: PayloadAction<string>) => {
      state.config.publicKey = action.payload;
    },
    setSaveCardOption: (
      state,
      action: PayloadAction<configPaymentOption["saveCardOption"]>,
    ) => {
      state.config.paymentOptions = {
        ...state.config.paymentOptions,
        saveCardOption: action.payload,
      } as configPaymentOption;
    },
    setTheme: (state, action: PayloadAction<ConfigSliceProps["themeMode"]>) => {
      state.themeMode = action.payload || ThemeMode.LIGHT;
    },
    setReferer: (
      state,
      action: PayloadAction<ConfigSliceProps["refererUrl"]>,
    ) => {
      state.refererUrl = action.payload;
    },
    setEncryptionKey: (
      state,
      action: PayloadAction<ConfigSliceProps["encryptionKey"]>,
    ) => {
      state.encryptionKey = action.payload;
    },
    setConfigPaymentOption: (
      state,
      action: PayloadAction<configPaymentOption>,
    ) => {
      state.config.paymentOptions = {
        ...state.config.paymentOptions,
        ...action.payload,
      };
      const amount = action.payload?.amount;
      if (amount && state.authentication) {
        state.authentication.amount = amount;
        state.authentication.order.amount = amount;
      }
      const currencyCode = action.payload?.currencyCode;
      if (currencyCode && state.authentication) {
        const currency = Array.isArray(currencyCode)
          ? currencyCode[0]
          : currencyCode;
        state.authentication.currency = currency;
        state.authentication.order.currency = currency;
      }

      const allCards = state.allCards;
      // AcceptedCards if payment_type==="card"
      const acceptedCards = getAcceptedCards({
        allCards,
        currencyCode,
      });
      const notAcceptedCards = getNotAcceptedCards({
        allCards,
        currencyCode,
      });
      state.supportedCards = acceptedCards;
      state.disabledCards = notAcceptedCards;

      if (
        isSupportedCurrency({
          currencyCode,
          supportedCurrencies: [
            action.payload?.sortedCurrencyCode as CURRENCIES,
          ],
        })
      ) {
        state.allCards = [
          ...acceptedCards.map((card) => ({ ...card, isDisabled: false })),
          ...notAcceptedCards.map((card) => ({ ...card, isDisabled: true })),
        ];
      } else {
        state.allCards = allCards.map((card) => ({
          ...card,
          isDisabled: !isSupportedCurrency({
            currencyCode,
            supportedCurrencies: card.supported_currencies,
          }),
        }));
      }
    },
    setPaymentOptions: (state, action: PayloadAction<Array<PaymentOption>>) => {
      const clickToPaySupportedCards = getClickToPaySupportedCards({
        paymentMethods: action.payload,
      });

      state.clickToPaySupportedCards = clickToPaySupportedCards.map((card) => ({
        ...card,
        isDisabled: false,
      }));
      // filter out payment_type==="card"
      const paymentOptions = action.payload.filter(
        (item) => item.payment_type !== "card",
      );
      state.paymentOptions = paymentOptions;

      const currencyCode = state.config.paymentOptions?.currencyCode;
      if (!currencyCode) {
        console.error("currencyCode is not defined");
        return;
      }

      const acceptedCards = action.payload
        .filter(
          (item) =>
            item.payment_type === "card" &&
            isSupportedCurrency({
              currencyCode,
              supportedCurrencies: item.supported_currencies,
            }),
        )
        .sort((a, b) =>
          a.order_by > b.order_by ? 1 : -1,
        ) as unknown as Array<SupportedCards>;
      state.supportedCards = acceptedCards;

      const notAcceptedCards = action.payload
        .filter(
          (item) =>
            item.payment_type === "card" &&
            !isSupportedCurrency({
              currencyCode,
              supportedCurrencies: item.supported_currencies,
            }),
        )
        .sort((a, b) =>
          a.order_by > b.order_by ? 1 : -1,
        ) as unknown as Array<SupportedCards>;
      state.disabledCards = notAcceptedCards;

      state.allCards = [
        ...acceptedCards.map((card) => ({ ...card, isDisabled: false })),
        ...notAcceptedCards.map((card) => ({ ...card, isDisabled: true })),
      ];
    },
    setCards: (state, action: PayloadAction<ConfigSliceProps["cards"]>) => {
      state.cards = action.payload;
    },
    setLanguages: (
      state,
      action: PayloadAction<ConfigSliceProps["languages"]>,
    ) => {
      state.languages = action.payload;
    },
    updateLanguage: (_, action) => {
      I18n.changeLanguage(action.payload);
    },
    setAuthentication: (
      state,
      action: PayloadAction<ConfigSliceProps["authentication"]>,
    ) => {
      state.authentication = action.payload;
    },
    setScope: (state, action: PayloadAction<ConfigSliceProps["scope"]>) => {
      state.scope = action.payload;
    },
    setFeatures: (
      state,
      action: PayloadAction<ConfigSliceProps["features"]>,
    ) => {
      state.features = action.payload;
    },
    setPowered: (state, action: PayloadAction<ConfigSliceProps["powered"]>) => {
      state.powered = action.payload;
    },
    setIP: (state, action: PayloadAction<ConfigSliceProps["ip"]>) => {
      state.ip = action.payload;
    },
    setCardCVV: (state, action: PayloadAction<ConfigSliceProps["cardCVV"]>) => {
      state.cardCVV = action.payload;
    },
    setSavedCardCVV: (
      state,
      action: PayloadAction<ConfigSliceProps["savedCardCVV"]>,
    ) => {
      state.savedCardCVV = action.payload;
    },
    setClickToPay: (
      state,
      action: PayloadAction<ConfigSliceProps["clickToPay"]>,
    ) => {
      state.clickToPay = { ...state.clickToPay, ...action.payload };
    },

    resetConfig: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchLocaleAsync.fulfilled, (state, payload: any) => {
      const { en, ar } = payload.payload;
      I18n.removeResourceBundle("en", "translation");
      I18n.removeResourceBundle("ar", "translation");
      I18n.addResourceBundle("en", "translation", en.translation, true, true);
      I18n.addResourceBundle("ar", "translation", ar.translation, true, true);
    });
    builder.addCase(fetchThemeAsync.fulfilled, (state, payload: any) => {
      state.theme = payload.payload.theme;
    });
  },
});

export const {
  setHideSavedCardForLoading,
  setHideErrorFooter,
  setCards,
  setConfig,
  setConfigPaymentOption,
  setReferer,
  setEncryptionKey,
  setPaymentOptions,
  setLanguages,
  resetConfig,
  setTheme,
  setPublicKey,
  updateLanguage,
  setSaveCardOption,
  setAuthentication,
  setScope,
  setFeatures,
  setPowered,
  setIP,
  setCardCVV,
  setSavedCardCVV,
  setClickToPay,
} = configSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const getConfig = (state: RootState) => state.config;
export default configSlice.reducer;
