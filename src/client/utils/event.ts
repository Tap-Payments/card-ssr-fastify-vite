import { EventMessage } from '../types/event'

export const sendEventGeneric = <T = any>(url: string, message: EventMessage<T>) => {
	if (message.event === 'dimension') {
		console.log({ message })
	}
	let targetUrl = url
	if (!targetUrl) {
		const parentUrl = parent.window?.[0]?.top?.[1].location.ancestorOrigins?.[0] ?? ''
		targetUrl = parentUrl
	}
	if (window?.parent?.postMessage) {
		window?.parent?.postMessage?.(message, targetUrl)
	}
}
