import type { Currencies, Direction, Edges, Locale } from './enums.js';

export interface OldPaymentOptions {
  locale?: Locale;
  direction?: Direction;
  showBrands?: boolean;
  showLoadingState?: boolean;
  collectHolderName?: boolean;
  preLoadCardName?: string;
  cardNameEditable?: boolean;
  currencyCode: Currencies;
  sortedCurrencyCode?: string;
  labels?: {
    cardNumber: string;
    expirationDate: string;
    cvv: string;
    cardHolder: string;
  };
  customer?: string;
  cardFundingSource?: string; //'all','credit','debit'
  saveCardOption?: 'all' | 'merchant' | 'tap' | 'none';
  forceLtr?: boolean;
  supportedPaymentMethods?: Array<string>;
  supportedCurrencies?: Array<string>;
  edges?: Edges;
  displayPaymentBrands?: boolean;
  cardCVV: boolean;
  savedCardCVV: boolean;
  paymentAllowed?: string[] | string;
}
