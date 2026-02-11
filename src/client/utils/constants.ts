export const RegexPatterns = Object.freeze({
  ENGLISH_ALPHANUMERIC: /^[A-Za-z0-9]+$/,
  WHITESPACES: /\s/g,
  NOT_HOLDER_NAME: /[^a-zA-Z\s.'-]/,
});

export const Timeouts = {
  BORDER_RADIUS_UPDATE: 600,
  THREE_DS_ACTIVE_DELAY: 500,
  LOADING_IFRAME_HIDE_DELAY: 1200,
  THREE_DS_INACTIVE_DELAY: 200,
  AUTH_FINISH_DELAY: 1000,
  AUTH_RESULT_FETCH_DELAY: 2000,
  TOKENIZATION_DELAY: 1000,
  DEFAULT_LOADING_DELAY: 500
};

export const Events = {
  TOKENIZE: 'tokenize',
  SAVE_CARD: 'saveCard',
  LOADING_IFRAME: 'loadingIframe',
  CLICK_2_PAY: 'click2Pay',
  AUTHENTICATION: 'authentication',
  THREE_DS_REDIRECT: '3dsRedirect',
  ON_3DS_REDIRECT: 'on3dsRedirect',
  ON_3DS_FINISH: 'on3dsFinish',
  TOKEN: 'token',
  REDIRECT_URL: 'redirectUrl',
  ERROR: 'error',
  LOAD_AUTHENTICATION: 'loadAuthentication',
  CANCEL_AUTHENTICATION: 'cancelAuthentication',
  LOAD_SAVED_CARD: 'loadSavedCard',
  HIDE_SAVED_CARD_OPTION: 'hideSavedCardOption',
  HIDE_ERROR_FOOTER: 'hideErrorFooter',
  UPDATE_PAYMENT_OPTION: 'updatePaymentOption',
  RESET: 'reset',
  UPDATE_THEME_MODE: 'updateThemeMode',
  UPDATE_PUBLIC_KEY: 'updatePublicKey',
  FILL_CARD_INPUTS: 'fillCardInputs',
  SEND_IP: 'sendIP',
  SEND_HEADERS: 'sendHeaders',
  FOCUSED: 'focused',
  BORDER_RADIUS: 'borderRadius',
  ON_CARD_READY: 'onCardReady',
  BACKGROUND_COLOR: 'backgroundColor',
  ACTION_3DS_IFRAME_ON_READY: '3dsIframe:onReady',
  ACTION_3DS_IFRAME_ON_FINISH: '3dsIframe:onFinish',
} as const;
