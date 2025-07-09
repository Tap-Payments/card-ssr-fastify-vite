import { RegexPatterns } from './constants'

export const allCharsInEN = (value: string) => RegexPatterns.ENGLISH_ALPHANUMERIC.test(value)

export const removeWhitespaces = (value: string) => value.replace(RegexPatterns.WHITESPACES, '')

export const removeNonHolderNameChars = (value: string) => value.replace(RegexPatterns.NOT_HOLDER_NAME, '')
export const isValidHolderName = (value: string) => !RegexPatterns.NOT_HOLDER_NAME.test(value)
export const resetEmptyString = (value: string | undefined) => value?.trim() || undefined
