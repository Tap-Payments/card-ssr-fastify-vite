import { ThemeMode, SuperThemeMode } from '../types'

export const getSuperThemeMode = (themeMode: ThemeMode): SuperThemeMode =>
	themeMode.includes('light') ? SuperThemeMode.LIGHT : SuperThemeMode.DARK
