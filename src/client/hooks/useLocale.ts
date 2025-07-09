import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { getConfig } from '../features/configSlice'
import { Locale, Page_Direction, Page_Alignment } from '../types'
import i18n from '../i18n'

export const useLocale = () => {
	const {
		i18n: { language }
	} = useTranslation()
	const { config } = useSelector(getConfig)
	// get language and direction from config, and fallback to i18n.
	const languageFromConfig = config.paymentOptions?.locale
	const directionFromConfig = config.paymentOptions?.direction
	const lang = (languageFromConfig || language) as Locale
	const direction = (directionFromConfig || 'ltr') as Page_Direction

	const isArabic = lang === Locale.ar
	const isEnglish = lang === Locale.en
	const isRTL = direction === Page_Direction.rtl
	const isLTR = direction === Page_Direction.ltr

	const alg = directionFromConfig === 'rtl' ? Page_Alignment.right : Page_Alignment.left
	const pageAlignment = directionFromConfig === undefined ? (isRTL ? Page_Alignment.right : Page_Alignment.left) : alg

	useEffect(() => {
		document.body.style.direction = direction
		document.documentElement.dir = direction
		document.documentElement.lang = language
	}, [language])

	const switchLang = () => {
		i18n.changeLanguage(isArabic ? Locale.en : Locale.ar)
	}

	const changeLocale = (locale: Locale) => {
		i18n.changeLanguage(locale)
	}

	return {
		isArabic,
		isEnglish,
		isRTL,
		isLTR,
		direction,
		language,
		switchLang,
		changeLocale,
		pageAlignment
	}
}
