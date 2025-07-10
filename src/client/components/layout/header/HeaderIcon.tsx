import { CreditCardType } from 'credit-card-type/dist/types'
import React, { memo, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { getCard } from '@features/cardSlice'
import { getConfig } from '@features/configSlice'
import { getGlobalState } from '@features/globalSlice'
import { useTheme } from '@hooks/useTheme'
import { BinTypeI } from '@shared/types/BinTypeI'
import { CardBrands } from '@shared/types/paymentOption'
import CardIcon from '../../icons/CardIcon'
import PaymentIcon from '../../icons/PaymentIcon'
import { sendEventGeneric } from '@utils'
import { Integration } from '@shared/types'

interface HeaderIconProps {
	cardType: CreditCardType | null
	binType: BinTypeI | null
}

const HeaderIcon: React.FC<HeaderIconProps> = ({ cardType, binType }) => {
	const { supportedCards, clickToPaySupportedCards, clickToPay, disabledCards, refererUrl, config } =
		useSelector(getConfig)
	const { globalMode, loadedCard } = useSelector(getGlobalState)
	const { loadedCardType } = useSelector(getCard)
	const { themeMode } = useTheme()
	const currentSupportedCards = clickToPay?.enabled ? clickToPaySupportedCards : supportedCards
	let type
	if (loadedCardType != null) {
		type = loadedCardType
	} else {
		if (binType == null) {
			if (cardType != null) type = cardType.type
		} else {
			type = binType.card_scheme
		}
	}
	const match_cardType_to_PAYMENT_METHODS = type
		? (type.toLocaleUpperCase().replace('-', '_') as unknown as CardBrands)
		: 'unkown'

	const cardTypeFormated = cardType?.type.toLocaleUpperCase().replace('-', '_') as unknown as CardBrands
	useEffect(() => {
		if (
			currentSupportedCards.find((card) => card.name === cardTypeFormated) ||
			disabledCards.find((card) => card.name === cardTypeFormated)
		) {
			sendEventGeneric(refererUrl, { event: 'brand', data: { brand: cardTypeFormated } })
		} else {
			sendEventGeneric(refererUrl, { event: 'brand', data: { brand: 'unkown' } })
		}
	}, [cardTypeFormated])

	// find url from configSlice supportedCards array
	let url
	if (globalMode === 'CreateTokenSavedCard' && loadedCard !== undefined) {
		url = loadedCard?.logos[themeMode].svg
	} else {
		url = currentSupportedCards.find((item) => item.name === match_cardType_to_PAYMENT_METHODS)?.logos[themeMode]
			.currency_widget.svg
		if (url === undefined && binType !== null && cardType !== null) {
			url = currentSupportedCards.find(
				(item) => item.name === (cardType.type.toLocaleUpperCase().replace('-', '_') as unknown as CardBrands)
			)?.logos[themeMode].currency_widget.svg
		}

		const disabledUrl = disabledCards.find((item) => item.name === match_cardType_to_PAYMENT_METHODS)?.logos[themeMode]
			.disabled.svg
		if (config.integration === Integration.CHECKOUT && !clickToPay?.enabled && !url && disabledUrl) {
			url = disabledUrl
		}
	}

	// if no url return empty span placeholder.
	if (!url || match_cardType_to_PAYMENT_METHODS === 'unkown') {
		return <CardIcon />
	} else return <PaymentIcon url={url} type={match_cardType_to_PAYMENT_METHODS} height='auto' />
}

HeaderIcon.displayName = 'HeaderIcon'
export default memo(HeaderIcon)
