import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    resetCard,
    setMode,
    setTypeSavedCard,
} from '@features/cardSlice'
import { resetDate, setDateValue, setDateValid } from '@features/dateSlice'
import { resetCVV, setCvvValue, setCvvSize } from '@features/cvvSlice'
import { resetHolderNameValue, changeHolderNameValue } from '@features/holdernameSlice'
import { setSaveCardForLater, setLoading, setLoadedCard, setGlobalMode } from '@features/globalSlice'
import { getConfig, setHideSavedCardForLoading } from '@features/configSlice'
import { isFuture, sendEventGeneric } from '@utils'
import { Timeouts, Events } from '../../utils/constants'
import type { CardInputs } from '@shared/types/Card'
import { useCardNumber } from '../useCardNumber'
import { useExpiryDate } from '../useExpiryDate'
import { useCvv } from '../useCvv'

export const useCardActions = () => {
    const dispatch = useDispatch()
    const { config: configProps, cards, features, refererUrl } = useSelector(getConfig)
    const { onChangeCardNumber } = useCardNumber()
    const { onChangeExpiryDate } = useExpiryDate()
    const { onChangeCvv } = useCvv()

    const handleClearInputs = React.useCallback(() => {
        dispatch(resetCard())
        dispatch(resetDate())
        dispatch(resetCVV())
        dispatch(resetHolderNameValue())
        dispatch(setGlobalMode('createToken'))
        dispatch(setSaveCardForLater(!!features?.customerCards?.autoSaveCard))
        dispatch(setLoadedCard(null))
        dispatch(setHideSavedCardForLoading(false))
    }, [dispatch, features])

    const fillCardInputs = React.useCallback((cardInputs: CardInputs) => {
        if (cardInputs.cardNumber) onChangeCardNumber(cardInputs.cardNumber)
        if (cardInputs.expiryDate) onChangeExpiryDate(cardInputs.expiryDate)
        if (cardInputs.cvv) onChangeCvv(cardInputs.cvv)

        const isHolderNameEditable =
            configProps.paymentOptions?.cardNameEditable === true ||
            (configProps.paymentOptions?.preLoadCardName?.length || 0) < 4
        if (cardInputs.cardHolderName && isHolderNameEditable) {
            dispatch(changeHolderNameValue(cardInputs.cardHolderName.toUpperCase()))
        }
    }, [onChangeCardNumber, onChangeExpiryDate, onChangeCvv, configProps, dispatch])

    const loadCardInputs = React.useCallback((cardId: string) => {
        dispatch(setGlobalMode('CreateTokenSavedCard'))
        dispatch(setMode('right'))
        dispatch(setCvvValue(''))
        if (!cards) return
        const card = cards.find((item) => item.id === cardId)
        if (card) {
            const { brand, expiry } = card
            const isAmex = brand === 'AMERICAN_EXPRESS'
            dispatch(setLoadedCard(card))
            dispatch(setTypeSavedCard(brand))
            dispatch(setCvvSize({ size: isAmex ? 4 : 3 }))
            const expireMonth =
                Number(expiry.month) < 10 ? `0${expiry.month}` : expiry.month
            dispatch(setDateValue(`${expireMonth}/${expiry.year}`))
            const { isDateInTheFuture } = isFuture(`${expireMonth}/${expiry.year}`)
            if (isDateInTheFuture) {
                dispatch(setDateValid(true))
                return
            }
            dispatch(setDateValid(false))
        } else {
            handleClearInputs()
        }
    }, [cards, dispatch, handleClearInputs])

    const startLoading = React.useCallback((delay = Timeouts.DEFAULT_LOADING_DELAY) => {
        dispatch(setLoading(true));
        setTimeout(() => {
            sendEventGeneric(refererUrl, { event: Events.LOADING_IFRAME, data: true });
        }, delay);
    }, [dispatch, refererUrl]);

    return {
        handleClearInputs,
        fillCardInputs,
        loadCardInputs,
        startLoading
    }
}
