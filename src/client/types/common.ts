import { CSSProperties } from 'react'

export interface SvgIconProps {
	size?: number
	style?: CSSProperties
}

export interface Period {
	date: {
		from: number
		to: number
	}
}
// accept any string, but suggest some specific values on autocomplete
export type StringWithAutocomplete<T> = T | (string & Record<never, never>)

// ex: type Fruit = StringWithAutocomplete<"apple" | "banana" | "grape">;
