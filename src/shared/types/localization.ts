export interface LocalizationObject {
  ar: LanguageObject;
  en: LanguageObject;
}
export interface LanguageObject {
  TapCardInputKit: TapCardInputLanguageKit;
  Hints: Hints;
  Common: Common;
}
export interface TapCardInputLanguageKit {
  cardNumberPlaceHolder: string;
  cardNamePlaceHolder: string;
  cardNamePlaceHolderThree: string;
  cardCVVPlaceHolder: string;
  cardExpiryPlaceHolder: string;
  cardSaveLabel: string;
  cardSaveForTapLabel: string;
  cardSaveForTapInfo: string;
  emailPlaceHolder: string;
  weSupport: string;
  cardSectionTitle: string;
  savedCardSectionTitle: string;
}

interface Common {
  next: string;
  previous: string;
  done: string;
  recent: string;
  edit: string;
  close: string;
  items: string;
  item: string;
  email: string;
  phone: string;
  password: string;
  change: string;
  cancel: string;
  confirm: string;
}

interface Hints {
  Warning: Warning;
  Error: Error;
}

interface Error {
  wrongCardNumber: string;
}

interface Warning {
  missingExpiryCVV: string;
  missingCVV: string;
  missingName: string;
}
