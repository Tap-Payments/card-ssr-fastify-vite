import React, { memo } from 'react'
import type { SvgIconProps } from '@shared/types/common'
import { useTheme } from '@hooks/useTheme'

interface CardIconProps extends SvgIconProps {
	width?: number
	height?: number
}

const LIGHT = '#626262'
const DARK = '#CFCFCF'

const CardIcon: React.FC<CardIconProps> = ({ width = 22, height = 25, style, ...props }: Readonly<CardIconProps>) => {
	const { isLight } = useTheme()

	return (
		<>
			<svg
				xmlns='http://www.w3.org/2000/svg'
				xmlSpace='preserve'
				viewBox='0 0 22 15'
				style={{
					...style
				}}
				width={width}
				height={height}
				{...props}
			>
				<path
					d='M3.2 0C1.5 0 0 1.5 0 3.2v8.5C0 13.5 1.5 15 3.2 15h15.5c1.8 0 3.2-1.5 3.2-3.2V3.2C22 1.5 20.5 0 18.8 0H3.2zm0 1.5h15.5c1 0 1.8.8 1.8 1.8V4h-19v-.8c0-.9.8-1.7 1.7-1.7zM1.5 6h19v5.8c0 1-.8 1.8-1.8 1.8H3.2c-1 0-1.8-.8-1.8-1.8V6zm13.3 4c-.1 0-.2 0-.3.1-.1 0-.2.1-.2.2-.1.1-.1.2-.2.2 0 .1-.1.2-.1.3s0 .2.1.3c0 .1.1.2.2.2.1.1.2.1.2.2.1 0 .2.1.3.1h3c.1 0 .2 0 .3-.1.1 0 .2-.1.2-.2.1-.1.1-.2.2-.2 0-.1.1-.2.1-.3s0-.2-.1-.3c0-.1-.1-.2-.2-.2-.1-.1-.2-.1-.2-.2-.1 0-.2-.1-.3-.1h-3z'
					style={{
						fill: isLight ? LIGHT : DARK
					}}
				/>
			</svg>
		</>
	)
}

CardIcon.displayName = 'CardIcon'
export default memo(CardIcon)
