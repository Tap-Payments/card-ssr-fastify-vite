import React, { memo } from 'react'
import { useTheme } from '@hooks/useTheme'

interface CancelIconProps {
	width?: number
	height?: number
}

const LIGHT_COLOR = '#626262'
const DARK_COLOR = '#b4b7bd'

const CancelIcon: React.FC<CancelIconProps> = ({ width = 9, height = 9, ...props }: Readonly<CancelIconProps>) => {
	const { isLight } = useTheme()

	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			viewBox='0 0 8 8'
			xmlSpace='preserve'
			width={width}
			height={height}
			{...props}
		>
			<path
				d='M7.3 0c-.2 0-.4.1-.6.2L4 3 1.3.2C1.2.2 1.1.1 1 .1 1 0 .9 0 .8 0 .6 0 .5 0 .3.1.2.2.1.3.1.5 0 .6 0 .8 0 .9c0 .1.1.3.2.4L3 4 .2 6.7c0 .1-.1.2-.1.3-.1.1-.1.2-.1.3 0 .1 0 .2.1.3 0 .1.1.2.2.2 0 .1.1.1.2.2H1c.1 0 .2-.1.2-.2L4 5.1l2.7 2.7c.1.1.2.1.3.2h.6c.1 0 .2-.1.2-.2.1-.1.1-.2.2-.2V7c0-.1-.1-.2-.2-.2L5.1 4l2.7-2.7c.1-.1.2-.2.2-.4V.5C7.9.3 7.8.2 7.7.1 7.6 0 7.4 0 7.3 0z'
				style={{
					fill: isLight ? LIGHT_COLOR : DARK_COLOR
				}}
			/>
		</svg>
	)
}

CancelIcon.displayName = 'CancelIcon'
export default memo(CancelIcon)
