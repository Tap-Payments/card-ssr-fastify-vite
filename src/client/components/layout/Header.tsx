import React, { memo, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
//
import { resetCard, getCard, setCardValue, setTypeSavedCard } from '../../features/cardSlice'
import { resetCVV, recoverLatestCvv, getCVV } from '../../features/cvvSlice'
import { resetDate, getDate, setDateValue, setDateValid } from '../../features/dateSlice'

import { resetHolderNameValue, getHolderName } from '../../features/holdernameSlice'
import { getConfig, setHideSavedCardForLoading } from '../../features/configSlice'
//
import { sendEventGeneric, isFuture } from '../../utils'
//
import Cvv from '../inputs/Cvv'
import MinCard from '../inputs/MinCard'
import CreditCard from '../inputs/CreditCard'
import ExpiryDate from '../inputs/ExpiryDate'
//
import CancelIcon from '../icons/CancelIcon'
import HeaderIcon from './header/HeaderIcon'
import BackIcon from '../icons/BackIcon'
//
import styles from './Header.module.css'
import { setSaveCardForLater, getGlobalState, setGlobalMode, setLoadedCard } from '../../features/globalSlice'
import { useErrors, useTheme } from '../../hooks'
import ScannerIcon from '../icons/ScannerIcon'
import NFCIcon from '../icons/NFCIcon'
import { Integration } from '../../types'

interface HeaderProps {
	validClass: boolean
	tinyScreen: boolean
	hideTranslate: boolean
}
const Header: React.FC<HeaderProps> = ({ validClass, tinyScreen, hideTranslate }) => {
	const dispatch = useDispatch()
	const { globalMode, loadedCard } = useSelector(getGlobalState)
	const {
		type: cardType,
		value: cardValue,
		BIN: BINCARD,
		isUserDoneTyping: isUserDoneTypingCard,
		mode: formMode,
		isValid: isValidCard
	} = useSelector(getCard)
	const { prevValue: prevDateValue, isUserDoneTyping: isUserDoneTypingDate } = useSelector(getDate)
	const { isUserDoneTyping: isUserDoneTypingCVV } = useSelector(getCVV)
	const { isUserDoneTyping: isUserDoneTypingHolderName } = useSelector(getHolderName)
	const { isShowCollectHolderName } = useErrors()

	const { refererUrl, config, features } = useSelector(getConfig)
	const { theme, getColorProperty } = useTheme()

	const handleClearInputs = React.useCallback(() => {
		dispatch(resetCard())
		dispatch(resetDate())
		dispatch(resetCVV())
		dispatch(setSaveCardForLater(!!features?.customerCards?.autoSaveCard))
		if (config.paymentOptions?.cardNameEditable === true || (config.paymentOptions?.preLoadCardName?.length || 0) < 4) {
			dispatch(resetHolderNameValue())
		}
	}, [])

	useEffect(() => {
		if (!cardValue) {
			dispatch(resetCard())
		}
	}, [cardValue])

	const resetLoadedCard = () => {
		dispatch(setCardValue(cardValue))
		dispatch(recoverLatestCvv())
		dispatch(setDateValue(prevDateValue))
		const { isDateInTheFuture } = isFuture(prevDateValue)
		if (isDateInTheFuture) {
			dispatch(setDateValid(true))
		} else {
			dispatch(setDateValid(false))
		}
		dispatch(setLoadedCard(null))
		dispatch(setGlobalMode('createToken'))
		dispatch(setTypeSavedCard(null))
		dispatch(setHideSavedCardForLoading(false))
		sendEventGeneric(refererUrl, {
			event: 'resetLoadedCard',
			data: true
		})
	}

	useEffect(() => {
		sendEventGeneric(refererUrl, {
			event: 'completeTyping',
			data: {
				completeTyping:
					isUserDoneTypingCard &&
					isUserDoneTypingDate &&
					isUserDoneTypingCVV &&
					(isShowCollectHolderName ? isUserDoneTypingHolderName : true)
			}
		})
	}, [
		isUserDoneTypingCard,
		isUserDoneTypingDate,
		isUserDoneTypingCVV,
		isUserDoneTypingHolderName,
		isShowCollectHolderName
	])

	return (
		<header
			key='card-header-container'
			className={`${styles['header']} ${validClass && styles['active']}`}
			style={{
				backgroundColor: getColorProperty(theme.inlineCard.commonAttributes.backgroundColor),
				color: getColorProperty(theme.inlineCard.textFields.textColor),
				...(tinyScreen && {
					padding: 6
				})
			}}
		>
			<section className={styles['icon-container']} aria-label='card-icon-container'>
				{loadedCard && <BackIcon onClick={resetLoadedCard} style={{ marginInlineEnd: 8, cursor: 'pointer' }} />}
				<HeaderIcon cardType={cardType} binType={BINCARD} />
			</section>
			<section style={{ maxHeight: 48, display: 'flex', flexDirection: 'row', width: '100%' }}>
				{globalMode === 'createToken' && <CreditCard />}
				<MinCard tinyScreen={tinyScreen} />
				<ExpiryDate tinyScreen={tinyScreen} />
				<Cvv tinyScreen={tinyScreen} hideTranslate={hideTranslate} />
				{config.integration !== Integration.MERCHANT && !isValidCard && (
					<>
						{!!features?.alternativeCardInputs?.cardNFC && (
							<NFCIcon
								style={{
									marginInlineEnd: '6px',
									display: formMode === 'right' ? 'block' : 'none'
								}}
								onClick={() => {
									sendEventGeneric(refererUrl, {
										event: 'onNfcClick',
										data: true
									})
								}}
							/>
						)}
						{!!features?.alternativeCardInputs?.cardScanner && (
							<ScannerIcon
								style={{
									display: formMode === 'right' ? 'block' : 'none'
								}}
								onClick={() => {
									sendEventGeneric(refererUrl, {
										event: 'onScannerClick',
										data: true
									})
								}}
							/>
						)}
					</>
				)}
			</section>

			{cardValue.length > 0 && !loadedCard && (
				<button type={'button'} title='cancel button' className={styles['cancel_button']} onClick={handleClearInputs}>
					<CancelIcon />
				</button>
			)}
		</header>
	)
}

Header.displayName = 'Header'
export default memo(Header)
