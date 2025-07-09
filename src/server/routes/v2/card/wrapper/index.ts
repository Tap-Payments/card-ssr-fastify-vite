// src/server/routes/wrapperRouter.ts
import { FastifyPluginAsync, FastifyRequest } from 'fastify'
import { createServer as createViteServer, ViteDevServer } from 'vite'
import path from 'path'
import fs from 'fs'
import { AppOptions } from '@server/config/app'
import { Integration } from '@shared/types'

// Helper function to resolve paths relative to your project root
const rootPath = path.resolve(__dirname, '..', '..', '..', '..', '..', '..') // Adjust path as needed to reach project root
const resolve = (p: string) => path.resolve(rootPath, p)

const index: FastifyPluginAsync<AppOptions> = async (fastify, opts): Promise<void> => {
	const { vite, isProd } = opts
	fastify.route({
		method: 'GET',
		url: '/',
		schema: {
			querystring: {
				type: 'object',
				properties: {
					configurations: {
						type: 'string'
					}
				},
				required: ['configurations']
			}
		},
		handler: async (req: any, res: any) => {
			const url = req.originalUrl
			const results = { integration: Integration.WEBVIEW }

			try {
				// 1. Read index.html
				let template = await fs.promises.readFile(isProd ? resolve('dist/index.html') : resolve('index.html'), 'utf-8')

				// 2. Apply Vite HTML transforms. This injects the Vite HMR client, and
				//    also applies HTML transforms from Vite plugins, e.g. global preambles
				//    from @vitejs/plugin-react
				template = await vite.transformIndexHtml(url, template)

				// 3. Load the server entry. vite.ssrLoadModule automatically transforms
				//    your ESM source code to be usable in Node.js! There is no bundling
				//    required, and provides efficient invalidation similar to HMR.
				const productionBuildPath = resolve('./dist/server/entry-server.mjs')
				const devBuildPath = resolve('./src/client/entry-server.tsx')
				const { render } = await vite.ssrLoadModule(isProd ? productionBuildPath : devBuildPath)

				// 4. render the app HTML. This assumes entry-server.js's exported `render`
				//    function calls appropriate framework SSR APIs,
				//    e.g. ReactDOMServer.renderToString()
				// eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
				const appHtml = await render(url, results)

				// 5. Inject the app-rendered HTML into the template.
				const html = template
					.replace(`<!--app-html-->`, appHtml)
					.replace(
						'<!--ssr-data-->',
						`<script type="application/json" id="ssr-data">${JSON.stringify(results)}</script>`
					)

				// 6. Send the rendered HTML back.
				res.status(200).header('Content-Type', 'text/html').send(html)
			} catch (e: any) {
				!isProd && vite.ssrFixStacktrace(e)
				// If an error is caught, let Vite fix the stack trace so it maps back to
				// your actual source code.
				vite.ssrFixStacktrace(e)
				// next(e)
			}
		}
	})
}

export default index
