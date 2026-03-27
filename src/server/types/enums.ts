export enum Direction {
  LTR = 'ltr',
  RTL = 'rtl',
  DYNAMIC = 'dynamic',
}

export enum Edges {
  STRAIGHT = 'straight',
  CURVED = 'curved',
  CIRCULAR = 'circular',
}

export enum Theme {
  DARK = 'dark',
  LIGHT = 'light',
  DYNAMIC = 'dynamic',
}
export enum FullThemeMode {
  DARK = 'dark',
  LIGHT = 'light',
  LIGHT_MONO = 'light_mono',
  DARK_COLORED = 'dark_colored',
}
export enum Currencies {
  AED = 'AED',
  BHD = 'BHD',
  EGP = 'EGP',
  EUR = 'EUR',
  GBP = 'GBP',
  KWD = 'KWD',
  OMR = 'OMR',
  QAR = 'QAR',
  SAR = 'SAR',
  USD = 'USD',
}

export enum Locale {
  AR = 'ar',
  EN = 'en',
  DYNAMIC = 'dynamic',
}

export enum Scope {
  TOKEN = 'Token',
  AUTHENTICATED_TOKEN = 'AuthenticatedToken',
  // SAVE_TOKEN = 'SaveToken',
  // SAVE_AUTHENTICATED_TOKEN = 'SaveAuthenticatedToken'
}

export enum Integration {
  CHECKOUT = 'checkout',
  MERCHANT = 'merchant',
  WEBVIEW = 'webview',
}

export enum ColorStyle {
  COLORED = 'colored',
  MONOCHROME = 'monochrome',
}

export enum Regions {
  LOCAL = 'LOCAL',
  REGIONAL = 'REGIONAL',
  GLOBAL = 'GLOBAL',
}

export enum PaymentTypes {
  CARD = 'CARD',
  DEVICE_WALLET = 'DEVICE_WALLET',
  EXPRESS_CHECKOUT_WALLET = 'EXPRESS_CHECKOUT_WALLET',
  PASS_THRU_WALLET = 'PASS_THRU_WALLET',
  STORED_VALUE_WALLET = 'STORED_VALUE_WALLET',
  CASH_WALLET = 'CASH_WALLET',
  BNPL = 'BNPL',
}

export enum Schemes {
  BENEFIT = 'BENEFIT',
  VISA = 'VISA',
  AMEX = 'AMEX',
  MASTERCARD = 'MASTERCARD',
  MADA = 'MADA',
  MEEZA = 'MEEZA',
  OMANNET = 'OMANNET',
}
