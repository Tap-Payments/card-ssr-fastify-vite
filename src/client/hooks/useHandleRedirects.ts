import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import API from '../api'
import { getConfig } from '../features/configSlice'
import { setLoading, setThreeDsHeight } from '../features/globalSlice'
import { sendEventGeneric } from '../utils'
export const useHandleRedirects = async () => {
	const dispatch = useDispatch()
	const { config: configProps, refererUrl } = useSelector(getConfig)
	const params = new URL(document.location.href).searchParams
	const tap_id = params.get('tap_id')

	const verifyCardId = localStorage.getItem('verifyCardId')
	const parentWindow = refererUrl

	const removeURLParameter = (url: string, parameter: string): string => {
		const urlParts = url.split('?')
		if (urlParts.length < 2) {
			return url
		}
		const [baseUrl, queryString] = urlParts
		const params = new URLSearchParams(queryString)
		params.delete(parameter)

		const newQueryString = params.toString()
		if (newQueryString === '') {
			return baseUrl
		}
		return `${baseUrl}?${newQueryString}`
	}

	const removeTransactionFromUrl = React.useCallback(() => {
		let url = window.location.href
		url = removeURLParameter(url, 'tap_id')
		url = removeURLParameter(url, 'data')
		window.history.replaceState(null, '', url)
	}, [])

	if (tap_id && verifyCardId) {
		try {
			dispatch(setLoading(true))
			sendEventGeneric(refererUrl, { event: 'loadingIframe', data: true })
			localStorage.removeItem('verifyCardId')
			const verifyCard = await API.cardService.getCardVerify({ verifyCardId, configProps, refererUrl })
			const { status, card, response } = verifyCard
			if (status === 'VALID') {
				sendEventGeneric(parentWindow, { event: 'savedCard', data: { card } })
			} else {
				sendEventGeneric(parentWindow, { event: '3dsFail', data: { threeDsFail: response } })
			}
		} catch (error) {
			console.error(error)
		} finally {
			dispatch(setThreeDsHeight(95))
			sendEventGeneric(refererUrl, { event: 'loadingIframe', data: false })
			dispatch(setLoading(false))
			removeTransactionFromUrl()
		}
	}
}
