import { useTranslation as useTranslationBase } from 'react-i18next'
import { Locale } from '../config/locale'
import type { DeepKeys } from '../types'

type LocaleType = DeepKeys<(typeof Locale)['en']>

export function useTranslation() {
	const { t } = useTranslationBase()

	return { t } as { t: (key: LocaleType) => string }
}
