/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { useCreditCard } from './hooks/useCreditCard'

//
import styles from './CreditCard.module.css'

const CreditCard = () => {
	const {
		style,
		direction,
		formMode,
		onChangeHandler,
		onPasteHandler,
		onClickHandler,
		switchToRight,
		onKeyHandler,
		isCardNumberError,
		placeholder,
		formattedCardValue,
		cardRef
	} = useCreditCard()

	const validClassName = formMode === 'right' ? `${styles['hide_left']}` : ''
	const inValidClassName = isCardNumberError() ? `${styles['input_error']}` : ''

	return (
		<input
			value={formattedCardValue}
			dir={direction}
			ref={cardRef}
			id='cardNumber'
			autoComplete={'cc-number'}
			name='card_input'
			data-testid='CreditCard'
			type={'text'}
			placeholder={placeholder}
			className={`${styles['cardinput_class']} ${validClassName} ${inValidClassName}`}
			style={style}
			onBlur={switchToRight}
			onChange={onChangeHandler}
			onPaste={onPasteHandler}
			onKeyDown={onKeyHandler}
			onClickCapture={onClickHandler}
			onKeyDownCapture={onKeyHandler}
		/>
	)
}

export default React.memo(CreditCard)
