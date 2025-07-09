import React, { memo } from 'react'
import { useTheme } from '../../hooks'
import styles from './BackIcon.module.css'

interface BackIconProps {
	width?: number
	height?: number
	style?: React.CSSProperties
	onClick?: () => void
}

const LIGHT_COLOR = '#626262'
const DARK_COLOR = '#CFCFCF'

const BackIcon: React.FC<BackIconProps> = ({
	width = 16,
	height = 16,
	onClick,
	style,
	...props
}: Readonly<BackIconProps>) => {
	const { isLight } = useTheme()

	return (
		<svg
			className={`${styles['back-icon']}`}
			width={width}
			height={height}
			style={style}
			onClick={onClick}
			{...props}
			viewBox='0 0 16 16'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
		>
			<path
				d='M11.4901 0.995447C11.3603 0.999231 11.237 1.0534 11.1464 1.14649L4.64639 7.64649C4.55266 7.74026 4.5 7.86742 4.5 8C4.5 8.13259 4.55266 8.25975 4.64639 8.35352L11.1464 14.8535C11.1925 14.9015 11.2476 14.9398 11.3087 14.9662C11.3698 14.9926 11.4355 15.0065 11.502 15.0072C11.5685 15.0079 11.6345 14.9953 11.6961 14.9701C11.7577 14.945 11.8136 14.9078 11.8607 14.8608C11.9077 14.8137 11.9449 14.7578 11.97 14.6962C11.9952 14.6346 12.0078 14.5686 12.0071 14.5021C12.0064 14.4356 11.9925 14.3699 11.9661 14.3088C11.9397 14.2477 11.9014 14.1926 11.8534 14.1465L5.70694 8L11.8534 1.85352C11.9256 1.78327 11.9748 1.69288 11.9947 1.59417C12.0146 1.49547 12.0043 1.39306 11.965 1.30034C11.9258 1.20761 11.8594 1.1289 11.7747 1.0745C11.69 1.0201 11.5908 0.992548 11.4901 0.995447Z'
				fill={isLight ? LIGHT_COLOR : DARK_COLOR}
			/>
		</svg>
	)
}

BackIcon.displayName = 'BackIcon'
export default memo(BackIcon)
