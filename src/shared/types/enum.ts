import DarkTheme from '@shared/data/darkTheme.json'
import LightTheme from '@shared/data/lightTheme.json'

export enum Locale {
	en = 'en',
	ar = 'ar'
}

export enum Page_Direction {
	ltr = 'ltr',
	rtl = 'rtl'
}

export enum Page_Alignment {
	left = 'left',
	right = 'right'
}

export type Theme = typeof DarkTheme | typeof LightTheme

export enum ThemeMode {
	DARK = 'dark',
	LIGHT = 'light',
	LIGHT_MONO = 'light_mono',
	DARK_COLORED = 'dark_colored'
}

export enum SuperThemeMode {
	DARK = 'dark',
	LIGHT = 'light'
}

export enum Scope {
	TOKEN = 'Token',
	AUTHENTICATED_TOKEN = 'AuthenticatedToken'
}

export enum Integration {
	CHECKOUT = 'checkout',
	MERCHANT = 'merchant',
	WEBVIEW = 'webview'
}

export enum Purpose {
	CHARGE = 'CHARGE',
	AUTHORIZE = 'AUTHORIZE',
	SAVE_TOKEN = 'SAVE_TOKEN',
	SAVE_AUTHENTICATED_TOKEN = 'SAVE_AUTHENTICATED_TOKEN'
}

export enum Edges {
	STRAIGHT = 'straight',
	CURVED = 'curved',
	CIRCULAR = 'circular'
}

export enum CardFundingSource {
	ALL = 'all',
	CREDIT = 'credit',
	DEBIT = 'debit'
}
