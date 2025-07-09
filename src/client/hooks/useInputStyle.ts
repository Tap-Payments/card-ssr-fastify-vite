import { useTheme } from './useTheme'
import { useLocale } from './useLocale'

/**
 * @description  - shared inline card input style hook
 */
export function useInputStyle() {
	const { direction } = useLocale()
	const { theme, getColorProperty, getFontFormat, superThemeMode } = useTheme()

	const style: React.CSSProperties = {
		backgroundColor: getColorProperty(theme.inlineCard.commonAttributes.backgroundColor),
		color: getColorProperty(theme.inlineCard.textFields.textColor),
		font: getFontFormat(theme.inlineCard.textFields.font),
		direction,
		textAlign: direction === 'rtl' ? 'right' : 'left',
		colorScheme: superThemeMode || 'light',
		boxShadow: `0 0 0px 1000px ${getColorProperty(theme.inlineCard.commonAttributes.backgroundColor)} inset`,
		'-webkit-text-fill-color': getColorProperty(theme.inlineCard.textFields.textColor)
	} as unknown as React.CSSProperties

	return style
}
