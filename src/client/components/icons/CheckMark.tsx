import React, { memo } from 'react'

interface CheckMarkProps {
	type: 'light' | 'dark'
	width?: number
	height?: number
}
const CheckMark: React.FC<CheckMarkProps> = ({ type, width = 9, height = 6.5, ...props }: Readonly<CheckMarkProps>) => {
	const LIGHT_COLOR = '#fff'
	const DARK_COLOR = '#b4b7bd'
	// const COLOR = themeConfig.skin === 'light' ? LIGHT_COLOR : DARK_COLOR;
	const COLOR = LIGHT_COLOR
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			viewBox='0 0 9 6.5'
			xmlSpace='preserve'
			width={width}
			height={height}
			{...props}
		>
			<path
				d='M7.7.2c.2-.1.4-.2.5-.2.2 0 .3 0 .4.1.2.1.3.2.4.4v.4c0 .1-.1.3-.2.4l-5 5c-.1.1-.3.2-.5.2s-.4-.1-.6-.2L.2 3.8c0-.1-.1-.2-.1-.3-.1 0-.1-.1-.1-.2s0-.2.1-.3c0-.1.1-.2.2-.2s.2-.1.2-.2c.1 0 .2-.1.3-.1s.2 0 .3.1c.1 0 .2.1.2.2l2 2L7.7.2z'
				style={{
					fill: COLOR
				}}
			/>
		</svg>
	)
}

CheckMark.displayName = 'CheckMark'
export default memo(CheckMark)
