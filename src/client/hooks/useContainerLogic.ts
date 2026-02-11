import React, { type ElementRef, useEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import {
    useErrors,
    useEvents,
    useLocale,
    useTheme,
    useValidatePost,
    useDimensionEvent,
} from '../hooks'
import { sendEventGeneric } from '@utils'
import { Timeouts, Events } from '../utils/constants'
import { getGlobalState } from '@features/globalSlice'
import { getCard } from '@features/cardSlice'
import { getConfig } from '@features/configSlice'
import { getAuthentication } from '@features/authenticationSlice'
import { Borders } from '../utils/layout'
import { Edges } from '@shared/types'
import packageJson from '../../../package.json'
import { getHolderName } from '@features/holdernameSlice'
import { THREE_DS_HEIGHT } from '@shared/config/constant'

export const useContainerLogic = () => {
    const inputsContainerRef = useRef<ElementRef<'section'>>(null)
    const containerRef = useRef<ElementRef<'div'>>(null)

    const {
        themeMode,
        refererUrl,
        config,
        hideSavedCardForLoading,
        supportedCards,
        hideErrorFooter,
        authentication,
        clickToPay
    } = useSelector(getConfig)

    const { loadedCard, loading, hideCardFor3ds } = useSelector(getGlobalState)
    const { mode, type: cardType, isInEnglish } = useSelector(getCard)
    const isCardNumberFullWidth = mode === 'left'
    const errors = useErrors()
    const {
        isHeaderValid,
        isAnyError,
        isShowCollectHolderName,
    } = errors

    const { direction, language, pageAlignment } = useLocale()
    useEvents()
    useValidatePost()
    useDimensionEvent()

    const { authenticationURL, showAuthenticationIframe, finishAuthenticationIframe, is3DsActive } =
        useSelector(getAuthentication)

    const { isInEnglish: isHolderNameInEnglish } = useSelector(getHolderName)

    const { theme, isDark, getColorProperty } = useTheme()
    const [isTinyScreen, setIsTinyScreen] = useState(false)
    const [hideTranslate, setHideTranslate] = useState(false)
    const [borderRadius, setBorderRadius] = useState(
        config.paymentOptions?.edges
            ? Borders[config.paymentOptions?.edges]
            : theme.inlineCard.commonAttributes.cornerRadius
    )
    const isClickToPayEnabled = clickToPay?.enabled === true


    const height3DS = useMemo(() => authentication?.height3DS || THREE_DS_HEIGHT, [authentication])

    const { offsetWidth, offsetHeight, radius } = theme.inlineCard.commonAttributes.shadow

    const isFocused = useRef(false) // Changed from let to ref to persist across renders

    const handleFocusTop = React.useCallback(() => {
        if (isFocused.current === true) return
        isFocused.current = true
        sendEventGeneric(refererUrl, { event: Events.FOCUSED, data: { focused: true } })
    }, [refererUrl])

    const handleBlurTop = React.useCallback(() => {
        isFocused.current = false
    }, [])

    const showCardHolderName = isHeaderValid && !loadedCard && !isAnyError && isShowCollectHolderName

    const defaultCardBorderRadius = theme.inlineCard.commonAttributes.cornerRadius
    const borderFromConfig = config.paymentOptions?.edges
    const starterBorderRadius = borderFromConfig ? Borders[borderFromConfig] : defaultCardBorderRadius

    useEffect(() => {
        let calculatedCardBorderRadius = starterBorderRadius

        const isCardFooterShown = isAnyError || showAuthenticationIframe || showCardHolderName

        if (borderFromConfig === Edges.CIRCULAR && isCardFooterShown) {
            calculatedCardBorderRadius = defaultCardBorderRadius
        }
        const time = showAuthenticationIframe ? Timeouts.BORDER_RADIUS_UPDATE : 0
        const updateBorderRadiusTimer = setTimeout(() => {
            setBorderRadius(calculatedCardBorderRadius)
        }, time)
        return () => clearTimeout(updateBorderRadiusTimer)
    }, [showCardHolderName, isAnyError, showAuthenticationIframe, finishAuthenticationIframe, borderFromConfig, starterBorderRadius, defaultCardBorderRadius])

    useEffect(() => {
        sendEventGeneric(refererUrl, {
            event: Events.BORDER_RADIUS,
            data: {
                borderRadius: finishAuthenticationIframe && !showCardHolderName ? starterBorderRadius : borderRadius
            }
        })
    }, [borderRadius, showCardHolderName, finishAuthenticationIframe, starterBorderRadius, refererUrl])

    useEffect(() => {
        sendEventGeneric(refererUrl, { event: Events.ON_CARD_READY, data: { ready: true } })
    }, [refererUrl])

    useEffect(() => {
        document.body.style.setProperty(
            '--placeholder-color',
            getColorProperty(theme.inlineCard.textFields.placeHolderColor)
        )
        document.body.style.setProperty('overflow', 'hidden')
    }, [theme, getColorProperty])

    useEffect(() => {
        const handleResize = () => {
            setIsTinyScreen((containerRef.current?.clientWidth || 0) < 320)
            setHideTranslate((containerRef.current?.clientWidth || 0) < 250)
        }
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const backgroundColor = getColorProperty(theme.inlineCard.commonAttributes.backgroundColor)
    useEffect(() => {
        const black = 'rgba(0, 0, 0, 0.1)'
        const white = 'rgba(255, 255, 255, 0.1)'

        const bg = isDark ? black : white
        sendEventGeneric(refererUrl, {
            event: Events.BACKGROUND_COLOR,
            data: {
                backgroundColor: bg
            }
        })
    }, [themeMode, isDark, refererUrl])

    const version = `iframe_${packageJson.version}`
    const sdkVersion = `sdk_${packageJson.dependencies['@tap-payments/card-web']}`
    const boxShadow = `${offsetHeight} ${offsetWidth} ${radius}px rgba(0, 0, 0, 0.15)`

    return {
        inputsContainerRef,
        containerRef,
        config,
        hideSavedCardForLoading,
        supportedCards,
        hideErrorFooter,
        authentication,
        loadedCard,
        loading,
        hideCardFor3ds,
        isCardNumberFullWidth,
        errors,
        direction,
        language,
        pageAlignment,
        cardType,
        isInEnglish,
        authenticationURL,
        showAuthenticationIframe,
        finishAuthenticationIframe,
        is3DsActive,
        isHolderNameInEnglish,
        isTinyScreen,
        hideTranslate,
        borderRadius,
        isClickToPayEnabled,
        height3DS,
        handleFocusTop,
        handleBlurTop,
        showCardHolderName,
        starterBorderRadius,
        backgroundColor,
        boxShadow,
        version,
        sdkVersion
    }
}
