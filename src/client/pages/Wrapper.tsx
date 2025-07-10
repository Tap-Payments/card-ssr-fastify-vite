import React, { useEffect, useState } from 'react'
import { useSearchParam } from '@hooks/useSearchParam'
import useResizeObserver from '@hooks/useResizeObserver'

interface CardWebModule {
	fillCardInputs: (...args: any[]) => any
	Integration: any
	loadAuthentication: (...args: any[]) => any
	cancelAuthentication: (...args: any[]) => any
	resetCardInputs: (...args: any[]) => any
	TapCard: React.ComponentType<any>
	tokenize: (...args: any[]) => any
	sendIP: (...args: any[]) => any
}

const Wrapper = React.memo(() => {
	if (typeof window === 'undefined') {
		return <></>
	}

	const [config, setConfig] = useState<any>()
	const [configurationsParam] = useSearchParam(['configurations'])
	const [cardWebModule, setCardWebModule] = useState<CardWebModule | null>(null)

	useEffect(() => {
		import('@tap-payments/card-web')
			.then((module) => {
				setCardWebModule(module as CardWebModule)
				;(window as any).generateTapToken = () => {
					module.tokenize()
				}
				;(window as any).loadAuthentication = (authUrl: string) => {
					module.loadAuthentication(authUrl)
				}
				;(window as any).cancelAuthentication = () => {
					module.cancelAuthentication()
				}
				;(window as any).fillCardInputs = (cardInputs: any) => {
					module.fillCardInputs(cardInputs)
				}
				;(window as any).setIP = (ip: string) => {
					module.sendIP(ip)
				}
			})
			.catch((error) => {
				console.error('Failed to load @tap-payments/card-web:', error)
			})
		return () => {
			;(window as any).generateTapToken = undefined
			;(window as any).loadAuthentication = undefined
			;(window as any).cancelAuthentication = undefined
			;(window as any).fillCardInputs = undefined
			;(window as any).setIP = undefined
		}
	}, [])

	useEffect(() => {
		if (configurationsParam) {
			setConfig(JSON.parse(decodeURIComponent(configurationsParam)))
		}
	}, [configurationsParam])

	const onResize = (target: HTMLDivElement) => {
		window.location.href = `tapCardWebSDK://onHeightChange?data=${target.clientHeight}`
	}

	const cardRef = useResizeObserver(onResize)

	if (!config || !cardWebModule) return <></>

	const { Integration, resetCardInputs, TapCard } = cardWebModule

	return (
		<div data-testid='CardWrapper' ref={cardRef} style={{ height: '100%', width: '100%' }}>
			<TapCard
				data-card-src='jscard-node-mw-CardWrapper'
				config={{
					...config,
					integration: Integration.WEBVIEW,
					headers: {
						application: config.headers?.application,
						mdn: config.headers.mdn?.split(' ').join('+')
					}
				}}
				onReady={() => {
					console.log('onReady')
					window.location.href = 'tapCardWebSDK://onReady'
				}}
				onFocus={() => {
					console.log('onFocus')
					window.location.href = 'tapCardWebSDK://onFocus'
				}}
				onBinIdentification={(data: any) => {
					console.log('onBinIdentification', data)
					window.location.href = `tapCardWebSDK://onBinIdentification?data=${window.btoa(JSON.stringify(data))}`
				}}
				onValidInput={(data: any) => {
					console.log('onValidInput', data)
					window.location.href = `tapCardWebSDK://onValidInput?data=${window.btoa(JSON.stringify(data))}`
				}}
				onInvalidInput={(data: any) => {
					console.log('onInvalidInput', data)
					window.location.href = `tapCardWebSDK://onInvalidInput?data=${window.btoa(JSON.stringify(data))}`
				}}
				onError={(data: any) => {
					console.log('onError', data)
					resetCardInputs()
					setTimeout(() => {
						window.location.href = `tapCardWebSDK://onError?data=${window.btoa(JSON.stringify(data))}`
					}, 500)
				}}
				onSuccess={(data: any) => {
					console.log('onSuccess', data)
					resetCardInputs()
					setTimeout(() => {
						window.location.href = `tapCardWebSDK://onSuccess?data=${window.btoa(JSON.stringify(data))}`
					}, 500)
				}}
				on3dsRedirect={(data: any) => {
					console.log('on3dsRedirect', data)
					window.location.href = `tapCardWebSDK://on3dsRedirect?data=${window.btoa(JSON.stringify(data))}`
				}}
				onNfcClick={() => {
					console.log('onNfcClick')
					window.location.href = 'tapCardWebSDK://onNfcClick'
				}}
				onScannerClick={() => {
					console.log('onScannerClick')
					window.location.href = 'tapCardWebSDK://onScannerClick'
				}}
				onChangeSaveCardLater={(data: any) => {
					console.log('onChangeSaveCardLater')
					window.location.href = `tapCardWebSDK://onChangeSaveCardLater?data=${window.btoa(JSON.stringify(data))}`
				}}
			/>
		</div>
	)
})

export default Wrapper
