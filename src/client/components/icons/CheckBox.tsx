import React, { memo } from 'react'
import styles from './CheckBox.module.css'

interface CheckBoxProps {
	isOn: boolean
	handleToggle: React.ChangeEventHandler<HTMLInputElement>
	onColor: string
	offColor: string
	size?: number
	style?: React.CSSProperties
}
const CheckBox: React.FC<CheckBoxProps> = ({
	isOn,
	handleToggle,
	onColor,
	offColor,
	size = 20,
	style
}: Readonly<CheckBoxProps>) => {
	return (
		<div className={styles['switch']}>
			<input
				id={`switch`}
				type='checkbox'
				checked={isOn}
				onChange={handleToggle}
				className={styles['switch-checkbox']}
			/>
			<label
				htmlFor={`switch`}
				className={styles['switch-label']}
				style={{ background: isOn ? onColor : offColor, ...style }}
			>
				<span className={styles[`switch-button`]} />
			</label>
		</div>
	)
}

CheckBox.displayName = 'CheckBox'
export default memo(CheckBox, (prevProps: { isOn: boolean }, nextProps: { isOn: boolean }) => {
	// Only re-render when 'isOn' changes
	return prevProps.isOn === nextProps.isOn
})
