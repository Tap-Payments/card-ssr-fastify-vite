/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  ColorStyle,
  Currencies,
  Direction,
  Edges,
  Integration,
  Locale,
  PaymentTypes,
  Regions,
  Schemes,
  Scope,
  Theme,
} from './enums.js';
import { ExtendableString } from './tsUtils.js';

export type SupportedPaymentMethods = 'ALL' | Array<string>;
export type supportedCurrencies = 'AUTO' | 'ALL' | Array<string>;

interface Customer {
  id?: string;
  name?: {
    lang: Locale;
    first: string;
    last: string;
    middle?: string;
  }[];
  nameOnCard?: string;
  editable?: boolean;

  contact?: {
    email?: string;
    phone?: {
      countryCode: string;
      number: string;
    };
  };
}
export interface PaymentOptions {
  locale: string;
  showBrands: boolean;
  showLoadingState: boolean;
  collectHolderName: boolean;
  preLoadCardName?: string;
  cardNameEditable: boolean;
  currencyCode: string[] | string;
  sortedCurrencyCode?: string;
  labels: {
    cardNumber: string;
    expirationDate: string;
    cvv: string;
    cardHolder: string;
  };
  customer?: string;
  cardFundingSource?: string; //'all','credit','debit'
  saveCardOption?: 'all' | 'merchant' | 'tap' | 'none';
  forceLtr?: boolean;
  supportedPaymentMethods: SupportedPaymentMethods;
  supportedCurrencies: supportedCurrencies;
}

export interface Authentication {
  amount: number; //REQUIRED. If not passed, default value will be 1
  currency: Currencies; //"REQUIRED : SAR"
  description?: string;
  metadata?: Record<string, string>;
  customer?: Customer;
  reference?: {
    transaction?: string;
    order?: string;
  };
  invoice?: {
    id: string;
  };
  authentication: {
    channel: string;
    purpose: string;
  };
  post?: {
    url: string;
  };
  merchant?: {
    id: string;
  };
  height3DS?: number;
}
export interface PaymentOptionsUpdateI {
  locale?: string;
  showBrands?: boolean;
  showLoadingState?: boolean;
  collectHolderName?: boolean;
  preLoadCardName?: string;
  cardNameEditable?: boolean;
  currencyCode?: string[] | string;
  sortedCurrencyCode?: string;
  labels?: {
    cardNumber: string;
    expirationDate: string;
    cvv: string;
    cardHolder: string;
  };
  paymentAllowed?: string[] | string;
  cardFundingSource?: string; //'all','credit','debit'
  saveCardOption?: 'all' | 'merchant' | 'tap' | 'none';
  forceLtr?: boolean;
  customer?: string;
}

export interface Features {
  acceptanceBadge?: boolean;
  alternativeCardInputs?: {
    cardScanner?: boolean;
    cardNFC?: boolean;
  };
  customerCards?: {
    saveCard?: boolean;
    autoSaveCard?: boolean;
  };
}

export interface UiInterface {
  locale?: Locale; //"REQUIRED : en or ar",
  theme?: Theme; //"REQUIRED : light or dark or dynamic. Default is dynaic",
  edges?: Edges; //"REQUIRED : straight or curved. Default is curved",
  cardDirection?: Direction; //"REQUIRED : ltr or dynamic. Default is dynamic"
  powered?: boolean;
  colorStyle?: ColorStyle;
  loader?: boolean; // It is a rename for show card loader flag
}

export type EventType =
  | 'loadingIframe'
  | '3dsRedirect'
  | '3dsFail'
  | 'tokenize'
  | 'authenticate'
  | 'saveCard'
  | 'loadSavedCard'
  | 'hideSavedCardOption'
  | 'updatePaymentOption'
  | 'reset'
  | 'threeDsRedirect'
  | 'updateThemeMode'
  | 'updatePublicKey'
  | 'token'
  | 'authentication'
  | '3dsResponse'
  | 'dimension'
  | 'savedCard'
  | 'cardInputs'
  | 'bin'
  | 'saveCardForLaterTap'
  | 'saveCardForLater'
  | 'resetLoadedCard'
  | 'focused'
  | 'redirectUrl'
  | 'onCardReady'
  | 'brand'
  | 'error'
  | 'cardMetaData'
  | 'hideErrorFooter'
  | 'completeTyping'
  | 'on3dsRedirect'
  | 'loadAuthentication'
  | 'cancelAuthentication'
  | 'onScannerClick'
  | 'onNfcClick'
  | 'fillCardInputs'
  | 'on3dsFinish'
  | 'sendIP'
  | 'sendHeaders';

export interface EventData<T = any> {
  event: EventType;
  data: T;
}

export type SupportedRegion = ExtendableString<`${Regions}`>;
export type SupportedCountry = string;
export type SupportedPaymentType = ExtendableString<`${PaymentTypes}`>;
export type SupportedScheme = ExtendableString<`${Schemes}`>;

export interface ConfigObject {
  scope?: Scope;
  operator: {
    publicKey: string; //"REQUIRED : merchant's public key"
  };
  merchant?: {
    id?: string; // "OPTIONAL : The merchant's Tap id."
  };
  purpose?: string;
  transaction?: {
    id?: string;
    mode?: string;
    cardHolderLogin?: {
      type?: string;
      timestamp?: string;
    };
    intent?: {
      id?: string;
    };
    metadata?: Record<string, string>;
    reference?: string;
    paymentAgreement?: {
      id?: string;
      type?: string;
      contract: {
        id?: string;
        type?: string;
        period?: {
          start_date?: number;
          end_date?: number;
          auto_renewal?: boolean;
        };
      };
      variable_amount: {
        id?: string;
        maximum_amount?: number;
      };
      scheduled_payments: {
        id?: string;
        count?: number;
        frequency?: {
          period?: string;
          count?: number;
        };
      };
    };
    airline?: {
      id?: string;
    };
  };
  invoice?: {
    id: string;
  };
  order: {
    amount: number; //REQUIRED. If not passed, default value will be 1
    currency: Currencies; //"REQUIRED : SAR"
    id?: string;
    description?: string;
    metadata?: Record<string, string>;
    reference?: string;
  };
  customer?: Customer;
  acceptance?: {
    // Details about payment options
    supportedSchemes?: SupportedScheme[]; // default all , 'AMEX', 'VISA', 'MASTERCARD', 'MADA'
    supportedFundSource?: string[]; // default ALL, 'DEBIT', 'CREDIT'
    supportedPaymentAuthentications?: string[]; // 3DS
    supportedRegions?: SupportedRegion[];
    supportedCountries?: SupportedCountry[];
    supportedPaymentTypes?: SupportedPaymentType[];
  };
  fieldVisibility?: {
    card: {
      // The merchant will control visbility of the fields. For now, all values will always be true except for the card holder name.
      cardHolder: boolean;
      cvv?: boolean;
      savedCardCVV?: boolean;
    };
  };
  features?: Features;
  interface?: UiInterface;
  reditrect?: {
    url: string;
  };
  post?: {
    url: string;
  };
  height3DS?: number;
  integration?: Integration;
  sortedCurrencyCode?: string;
  checkoutProfileResponse?: {
    session: string;
    merchant: {
      id: string;
    };
    payment_options: {
      id: string;
      cards?: Array<string>;
      order?: {};
      payment_methods: Array<string>;
      supported_currencies: Array<string>;
    };
    assests: { [key: string]: any };
  };
  headers?: {
    mdn: string;
    application: string;
    ip?: string;
    domain?: string;
  };
  sdkVersion?: string;
}

export interface Device {
  browser: string;
  browserDetails?: {
    screenHeight?: number;
    screenWidth?: number;
    language?: string;
    colorDepth?: number;
    javaEnabled?: boolean;
    javaScriptEnabled?: boolean;
    timeZone?: number;
    acceptHeaders?: string;
    '3DSecureChallengeWindowSize'?: string;
  };
  browserLocale: string;
  themeMode: Theme;
}
