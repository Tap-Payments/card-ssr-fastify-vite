import React, { memo } from 'react'
import styles from './Wrapper.module.css'

interface WrapperProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	children: React.ReactNode
	style?: React.CSSProperties
}
const Wrapper: React.FC<WrapperProps> = ({ children, ...props }) => {
	return (
		<div {...props} className={`${styles['wrapper']} ${props.className ?? ''}`}>
			{children}
		</div>
	)
}

Wrapper.displayName = 'Wrapper'
export default memo(Wrapper)
