import axios from 'axios'
import LocaleFile from '../data/localization.json'
import LightThemeFile from '../data/lightTheme.json'
import DarkThemeFile from '../data/darkTheme.json'
import { ThemeMode } from '../types'

function getLocale(url: string) {
	return axios({
		method: 'get',
		timeout: 5000,
		url
	})
		.then((response) => {
			return {
				ar: { translation: response.data['ar'] || {} },
				en: { translation: response.data['en'] || {} }
			}
		})
		.catch(() => {
			return {
				ar: { translation: LocaleFile['ar'] },
				en: { translation: LocaleFile['en'] }
			}
		})
}

function getTheme(mode: ThemeMode, url: string) {
	return axios({
		method: 'get',
		timeout: 5000,
		url
	})
		.then((response) => {
			return response.data[`web-${mode}-v2`]
		})
		.catch(() => {
			return mode === ThemeMode.LIGHT ? LightThemeFile : DarkThemeFile
		})
}

export const appService = {
	getLocale,
	getTheme
}
