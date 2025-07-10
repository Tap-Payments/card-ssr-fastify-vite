import fs from 'fs'
import fetch from 'node-fetch'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function generateTheme({ themeURL, themeJSONFileName, themeFileName, constName, objectName }) {
	try {
		// @ts-ignore
		const response = await fetch(themeURL, {
			method: 'GET'
		})
		if (!response.ok) {
			throw new Error(`Failed to fetch theme: ${response.statusText}`)
		}
		const data = await response.json()
		if (!data) {
			throw new Error(`Failed to parse data theme ${themeFileName}`)
		}
		const theme = objectName ? data[objectName] : data
		if (!theme) {
			throw new Error(`Failed to parse theme ${themeFileName}`)
		}

		// Ensure the directory exists
		const dir = path.dirname(themeJSONFileName)
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir, { recursive: true })
		}

		// Save as const to ensure literal types
		const themeString = `export const ${constName} = ${JSON.stringify(theme, null, 2)} as const;`
		fs.writeFileSync(themeJSONFileName, JSON.stringify(data, null, 2))
		fs.writeFileSync(themeFileName, themeString)
		console.log(`Theme generated successfully for ${themeFileName}.`)
	} catch (error) {
		console.error(`Error generating theme for ${themeFileName}:`, error)
	}
}

const lightThemeURL = 'https://tapcardcheckout-default-rtdb.firebaseio.com/TapThemeMobile/light.json'
const darkThemeURL = 'https://tapcardcheckout-default-rtdb.firebaseio.com/TapThemeMobile/dark.json'

async function generateThemes() {
	// /src/configs/light.ts
	await generateTheme({
		themeURL: lightThemeURL,
		constName: 'LightThemeObject',
		objectName: 'web-light-v2',
		themeFileName: path.join(__dirname, '../config/light.ts'),
		themeJSONFileName: path.join(__dirname, '../data/lightTheme.json')
	})
	await generateTheme({
		themeURL: darkThemeURL,
		constName: 'DarkThemeObject',
		objectName: 'web-dark-v2',
		themeFileName: path.join(__dirname, '../config/dark.ts'),
		themeJSONFileName: path.join(__dirname, '../data/darkTheme.json')
	})
}

generateThemes()
