import { useSelector } from 'react-redux'
import { getConfig } from '@features/configSlice'
import { SuperThemeMode, ThemeMode } from '@shared/types'
import darkTheme from '@shared/data/darkTheme.json'
import lightTheme from '@shared/data/lightTheme.json'
import { useLocale } from './useLocale'
import { getSuperThemeMode } from '@utils'

export const useTheme = () => {
	const { theme: currentTheme, themeMode } = useSelector(getConfig)
	const { language } = useLocale()

	const superThemeMode = getSuperThemeMode(themeMode)
	const isDark = superThemeMode === SuperThemeMode.DARK
	const isLight = superThemeMode === SuperThemeMode.LIGHT
	const localTheme = { light: lightTheme, dark: darkTheme }

	const theme = currentTheme[superThemeMode] || localTheme[superThemeMode]

	const getFontFormat = (themeFormat: string, forceEN = false): string => {
		type fontWeightType = 'Light' | 'Regular' | 'Bold'
		const weightMatrix: Record<fontWeightType, number> = {
			Light: 300,
			Regular: 400,
			Bold: 500
		}
		const formatArray = themeFormat.split('-').join(',').split(',')
		if (language === 'ar' && !forceEN) {
			formatArray[0] = 'Tap Tajawal'
		} else {
			formatArray[0] = 'Tap Sans'
		}

		if (formatArray.length === 2) return `${formatArray[1]}px ${formatArray[0]}`

		if (formatArray.length === 3)
			return `${weightMatrix[formatArray[1] as fontWeightType]} ${formatArray[2]}px ${formatArray[0]}`

		return themeFormat
	}

	const getColorProperty = (color: string | keyof typeof theme.GlobalValues.Colors): string => {
		return theme.GlobalValues.Colors[color as keyof typeof theme.GlobalValues.Colors] || color
	}

	return {
		isDark,
		isLight,
		themeMode,
		superThemeMode,
		theme,
		getColorProperty,
		getFontFormat
	}
}
