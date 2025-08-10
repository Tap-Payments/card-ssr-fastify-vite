import type { Authentication } from "./Authentication";
import type {
  CardFundingSource,
  Edges,
  Integration,
  Scope,
  ThemeMode,
} from "./enum";

export interface configPaymentOption {
  locale: "en" | "ar" | null;
  collectHolderName: boolean | true;
  preLoadCardName: string | "";
  cardNameEditable: boolean | true;
  amount?: number;
  currencyCode: string[] | string;
  sortedCurrencyCode: string;
  labels: {
    cardNumber: string;
    expirationDate: string;
    cvv: string;
    cardHolder: string;
  };
  customer?: string;
  cardFundingSource?: CardFundingSource;
  saveCardOption?: "all" | "merchant" | "tap" | "none";
  edges: Edges;
  displayPaymentBrands: boolean;
  direction?: "ltr" | "rtl";
  cardCVV?: boolean;
  savedCardCVV?: boolean;
  clickToPay?: {
    enabled: boolean;
  };
}
export interface Features {
  acceptanceBadge?: boolean;
  alternativeCardInputs: {
    cardScanner: boolean;
    cardNFC: boolean;
  };
  customerCards?: {
    saveCard?: boolean;
    autoSaveCard?: boolean;
  };
}
export interface UiInterface {
  powered?: boolean;
}
export interface configProps {
  publicKey: string;
  encryptionKey: string;
  mid?: string;
  showCardHolderName: boolean;
  paymentOptions?: configPaymentOption;
  themeMode: ThemeMode;
  integration: Integration;
  authentication?: Authentication;
  scope: Scope;
  features?: Features;
  interface?: UiInterface;
  sdkVersion?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}
