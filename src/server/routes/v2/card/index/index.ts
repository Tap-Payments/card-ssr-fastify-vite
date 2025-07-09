// src/server/routes/wrapperRouter.ts
import { FastifyPluginAsync } from 'fastify'
import { createServer as createViteServer } from 'vite'
import path from 'path'
import fs from 'fs'
import controller from '@server/controllers/baseController'
import { AppOptions } from '@server/config/app'

const getStyleSheets = async () => {
	try {
		const assetPath = resolve('dist/assets')
		const files = await fs.promises.readdir(assetPath)
		const cssAssets = files.filter((l) => l.endsWith('.css'))
		const allContent: string[] = []
		for (const asset of cssAssets) {
			const content = await fs.promises.readFile(path.join(assetPath, asset), 'utf-8')
			allContent.push(`<style type="text/css">${content}</style>`)
		}
		return allContent.join('\n')
	} catch {
		return ''
	}
}
// Helper function to resolve paths relative to your project root
const rootPath = path.resolve(__dirname, '..', '..', '..', '..', '..', '..') // Adjust path as needed to reach project root
const resolve = (p: string) => path.resolve(rootPath, p)

const index: FastifyPluginAsync<AppOptions> = async (fastify, opts): Promise<void> => {
	const { vite, isProd } = opts
	const stylesheets = getStyleSheets()

	// fastify.addHook('preHandler', (request, reply, done) => {
	// 	RequestParser.frameRequestParser(request, reply, done)
	// 	//done()
	// })

	fastify.route({
		method: 'GET',
		url: '.html',
		schema: {
			querystring: {
				type: 'object',
				properties: {
					publicKey: {
						type: 'string'
					},
					mid: {
						type: 'string',
						nullable: true,
						default: null
					},
					application: {
						type: 'string'
					},
					tap_id: {},
					data: {
						type: 'string'
					}
				},
				required: ['publicKey']
			}
		},
		handler: async (req: any, res: any) => {
			const url = req.originalUrl
			const results = await controller.makeFrame(req, fastify, res)

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
				const cssAssets = isProd ? '' : await stylesheets

				// 5. Inject the app-rendered HTML into the template.
				const html = template
					.replace(`<!--app-html-->`, appHtml)
					.replace(`<!--head-->`, cssAssets)
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
