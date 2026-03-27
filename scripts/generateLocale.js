import fs from 'fs'
import fetch from 'node-fetch'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function generateLocale({ localeURL, localeJSONFileName, localeFileName, constName }) {
	try {
		// @ts-ignore
		const response = await fetch(localeURL, {
			method: 'GET'
		})
		if (!response.ok) {
			throw new Error(`Failed to fetch locale: ${response.statusText}`)
		}
		const data = await response.json()
		if (!data) {
			throw new Error(`Failed to parse data locale ${localeFileName}`)
		}

		// Ensure the directory exists
		const dir = path.dirname(localeJSONFileName)
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir, { recursive: true })
		}

		// Save as const to ensure literal types
		const localeString = `export const ${constName} = ${JSON.stringify(data, null, 2)} as const;`
		fs.writeFileSync(localeJSONFileName, JSON.stringify(data, null, 2))
		fs.writeFileSync(localeFileName, localeString)
		console.log(`Locale generated successfully for ${localeFileName}.`)
	} catch (error) {
		console.error(`Error generating locale for ${localeFileName}:`, error)
	}
}

const localeURL = 'https://tapcardcheckout-default-rtdb.firebaseio.com/TapLocalisation.json'

async function generateLocales() {
	await generateLocale({
		localeURL,
		constName: 'Locale',
		localeFileName: path.join(__dirname, '../src/shared/config/locale.ts'),
		localeJSONFileName: path.join(__dirname, '../src/shared/data/localization.json')
	})
}

generateLocales()
