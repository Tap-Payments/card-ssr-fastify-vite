import 'module-alias/register'
import { createApp } from './app'

const PORT = Number(process.env.PORT || 4001)
const HOST = process.env.HOST || '127.0.0.1';

let initialized = false
async function main() {
	if (initialized) return
	initialized = true
	createApp()
		.then((app) => {
			app.listen({ port: Number(PORT), host: HOST }, () => {
				console.log(`App is listening on http://localhost:${PORT}, Environment: ${process.env.NODE_ENV}`)
			})
		})
		.catch((e) => {
			console.error(e)
			process.exit(1)
		})
}

main()
