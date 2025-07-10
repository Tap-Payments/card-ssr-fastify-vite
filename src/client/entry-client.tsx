import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Integration } from '@shared/types'

const LazyCard = React.lazy(() => import('./pages/Card'))
const LazyWrapper = React.lazy(() => import('./pages/Wrapper'))

const App = () => {
	const ssrDataElement = document.getElementById('ssr-data')
	const options = ssrDataElement ? JSON.parse(ssrDataElement.textContent || '{}') : {}
	const isWrapper = options?.integration === Integration.WEBVIEW

	return (
		<React.StrictMode>
			<BrowserRouter>
				<Suspense fallback={<div />}>
					{isWrapper ? <LazyWrapper /> : <LazyCard defaultCardConfiguration={options} />}
				</Suspense>
			</BrowserRouter>
		</React.StrictMode>
	)
}

const rootElement = document.getElementById('app')

if (rootElement) {
	const root = ReactDOM.createRoot(rootElement)
	root.render(<App />)
} else {
	console.error('Root element #app not found. Cannot render React app.')
}
