declare module '*.module.css' {
	const classes: { [key: string]: string }
	export default classes
}

declare module '*.jpg'
//declare module '*.png';

declare module '*.png' {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const value: any
	export = value
}
