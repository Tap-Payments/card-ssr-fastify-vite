export function toSnakeCase(value: string) {
	const trimmedValue = value.trim().replace(/ /g, '_')
	return trimmedValue
}

export function isValidString(value: unknown): value is string {
	return typeof value === 'string' && value.trim() !== ''
}

export function cleanCountryCode(countryCode: string): string {
	if (countryCode.startsWith(' ') && !countryCode.startsWith('+')) {
		countryCode = '+' + countryCode.trim()
	}
	return countryCode
}
