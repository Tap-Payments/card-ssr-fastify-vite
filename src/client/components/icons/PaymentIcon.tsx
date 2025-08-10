import React, { memo } from 'react'
import type { CardBrands, PAYMENT_METHODS } from '@shared/types/paymentOption'
import { Opacity } from '../Animation'

interface PaymentIconProps
	extends React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {
	type: PAYMENT_METHODS | CardBrands
	url: string
	width?: number
	height?: number | string | 'auto'
}
const PaymentIcon: React.FC<PaymentIconProps> = ({
	type,
	url,
	width,
	height,
	...props
}: Readonly<PaymentIconProps>) => {
	return (
		<Opacity key={`${type}-payment-icon`}>
			<img data-testid='PaymentIcon' {...props} src={url} alt={type} width={width} height={height} />
		</Opacity>
	)
}

PaymentIcon.displayName = 'PaymentIcon'
export default memo(PaymentIcon, (prevProps: { url: string }, nextProps: { url: string }) => {
	// Only re-render when 'url' changes
	return prevProps.url === nextProps.url
})
