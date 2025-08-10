import React, { memo } from 'react'
import { useTheme } from '../../hooks'

interface ExclamationIconProps {
	width?: number
	height?: number
}
const LIGHT_COLOR = '#626262'
const DARK_COLOR = '#b4b7bd'

const ExclamationIcon: React.FC<ExclamationIconProps> = ({
	width = 9,
	height = 9,
	...props
}: Readonly<ExclamationIconProps>) => {
	const { isLight } = useTheme()
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			xmlnsXlink='http://www.w3.org/1999/xlink'
			x={0}
			y={0}
			viewBox='0 0 16 16'
			xmlSpace='preserve'
			width={width}
			height={height}
			{...props}
		>
			<style>{'.ExclamationIcon_st0{clip-path:url(#SVGID_00000096763678343438109540000013848040933763820984_)}'}</style>
			<defs>
				<path id='SVGID_1_' d='M0 0h16v16H0z' />
			</defs>
			<clipPath id='SVGID_00000138540472996636946190000012742938801154569375_'>
				<use
					xlinkHref='#SVGID_1_'
					style={{
						overflow: 'visible'
					}}
				/>
			</clipPath>
			<g
				style={{
					clipPath: 'url(#SVGID_00000138540472996636946190000012742938801154569375_)'
				}}
			>
				<path
					d='M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 1.2c3.8 0 6.8 3 6.8 6.8s-3 6.8-6.8 6.8-6.8-3-6.8-6.8 3-6.8 6.8-6.8zM8 4c-.2 0-.4.1-.6.2-.1.2-.2.4-.2.6 0 .2.1.4.2.6.2.1.4.2.6.2.2 0 .4-.1.6-.2.1-.2.2-.4.2-.6 0-.2-.1-.4-.2-.6-.2-.1-.4-.2-.6-.2zm0 2.8c-.2 0-.3.1-.4.2-.1.1-.2.2-.2.4V12c0 .1.1.1.1.2.1.1.1.1.2.1h.4c.1 0 .1-.1.2-.1.1-.1.1-.1.1-.2V7.2c.1-.1.1-.2 0-.2 0-.1-.1-.1-.2-.2H8z'
					style={{
						fill: isLight ? LIGHT_COLOR : DARK_COLOR
					}}
				/>
			</g>
		</svg>
	)
}

ExclamationIcon.displayName = 'ExclamationIcon'
export default memo(ExclamationIcon)
