import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
/** @type {import('vite').UserConfig} */
export default defineConfig(() => ({
	build: {
		// Ensure that your production build targets are appropriate
		// for server-side rendering, if you have specific SSR requirements.
		ssr: './src/client/entry-server.tsx' // Adjust this path if your SSR entry is different
	},
	ssr: {
		// This is the key part to fix the SSR import error for problematic packages.
		// It tells Vite to process and bundle these packages even for the server build,
		// effectively bypassing Node.js's native module resolution for them.
		noExternal: [
			'@tap-payments/card-web',
			'@tap-payments/browser-info',
			'jsencrypt',
			// If you encounter similar errors with other dependencies of '@tap-payments/card-web'
			// or other problematic packages, you might need to add them here as well.
		]
	},
	plugins: [
		react(),
		tsconfigPaths(),
		{
			name: 'html-inject-nonce-into-script/link-tag',
			enforce: 'post',
			transformIndexHtml(html: string) {
				const { env } = process
				const nonce = env['SERVER-GENERATED-NONCE']
				// const linkRegex = /<link(.*)>/g
				const scriptRegex = /<script(.*)>/g
				const scriptNonce = `<script nonce="${nonce}"$1>`
				// const linkNonce = `<link nonce="${nonce}"$1>`
				return (
					html
						// .replace(linkRegex, linkNonce)
						.replace(scriptRegex, scriptNonce)
						.replace(/nonce="undefined"/g, '')
				)
			}
		}
	]
}))
