import React, { Suspense } from 'react'
import ReactDOMServer from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { Integration } from '@shared/types'

const LazyCard = React.lazy(() => import('./pages/Card'))
const LazyWrapper = React.lazy(() => import('./pages/Wrapper'))

export function render(url: string, options: Record<string, string>) {
	const isWrapper = options?.integration === Integration.WEBVIEW
	return ReactDOMServer.renderToString(
		<React.StrictMode>
			<StaticRouter location={url}>
				<Suspense fallback={<div />}>
					{isWrapper ? <LazyWrapper /> : <LazyCard defaultCardConfiguration={options} />}
				</Suspense>
			</StaticRouter>
		</React.StrictMode>
	)
}
