import React, { memo } from 'react'
import type { CURRENCIES, PAYMENT_METHODS } from '@shared/types/paymentOption'

interface IconProps {
	type: CURRENCIES | PAYMENT_METHODS
	width?: number
	height?: number
}
const Icon: React.FC<IconProps> = ({ type, width = 23, height = 23 }: Readonly<IconProps>) => {
	return (
		<>
			<div className={`icon ${type}`} style={{ width, height }}></div>
		</>
	)
}

Icon.displayName = 'Icon'
export default memo(
	Icon,
	(prevProps: { type: CURRENCIES | PAYMENT_METHODS }, nextProps: { type: CURRENCIES | PAYMENT_METHODS }) => {
		// Only re-render when 'type' changes
		return prevProps.type === nextProps.type
	}
)
