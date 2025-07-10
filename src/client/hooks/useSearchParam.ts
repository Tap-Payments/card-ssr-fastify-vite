import { useCallback, useEffect, useState } from 'react'

export const useSearchParam = (params: string[]) => {
	const getValue = useCallback(
		() => params.map((param) => new URLSearchParams(window.location.search).get(param) || undefined),
		[params]
	)

	const [value, setValue] = useState(getValue)

	useEffect(() => {
		const onChange = () => {
			setValue(getValue())
		}

		window.addEventListener('popstate', onChange)
		window.addEventListener('pushstate', onChange)
		window.addEventListener('replacestate', onChange)

		return () => {
			window.removeEventListener('popstate', onChange)
			window.removeEventListener('pushstate', onChange)
			window.removeEventListener('replacestate', onChange)
		}
	}, [getValue])

	return value
}
