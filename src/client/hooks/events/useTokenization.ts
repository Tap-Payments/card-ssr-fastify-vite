import { useDispatch, useSelector } from 'react-redux'
import { Timeouts, Events } from '../../utils/constants'

import API from '../../api'
import { useC2P, useErrors } from '../../hooks'
import { sendEventGeneric } from '@utils'
import { Integration, Purpose, Scope } from '@shared/types'
import { getExactCardValue } from '@features/cardSlice'
import { getDate } from '@features/dateSlice'
import { getCVV } from '@features/cvvSlice'
import { getHolderName } from '@features/holdernameSlice'
import {
    getConfig,
    setHideSavedCardForLoading,
} from '@features/configSlice'
import {
    setLoading,
    getGlobalState,
} from '@features/globalSlice'
import { setAuthenticationURL } from '@features/authenticationSlice'
import type { TokenTypeI } from "@shared/types/TokenTypeI";
import { useCardActions } from './useCardActions'

// eslint-disable-next-line
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const useTokenization = () => {
    const dispatch = useDispatch()
    const { encrypt, loadScr } = useC2P()
    const { isAllInputsValid } = useErrors()
    const { handleClearInputs, startLoading } = useCardActions()

    const cardValue = useSelector(getExactCardValue)
    const { globalMode, loadedCard, saveCardForLater } = useSelector(getGlobalState)
    const { value: dateValue } = useSelector(getDate)
    const { value: cvvValue } = useSelector(getCVV)
    const { value: nameValue } = useSelector(getHolderName)

    // Select specific parts of authentication to avoid re-renders if possible, or just the whole obj
    const { authentication } = useSelector(getConfig)

    // wait, getConfig returns "authentication" which is configProps['authentication']
    // getAuthentication returns slice state which has "authenticationURL", etc.
    // In useEvents: const { authentication } = useSelector(getConfig); and const { authenticationURL } = useSelector(getAuthentication);

    const {
        config: configProps,
        encryptionKey,
        refererUrl,
        scope,
        ip,
        clickToPay,
    } = useSelector(getConfig)


    const handleTokenize = async (eventOrigin: string, eventType: string, data: any) => {
        const isSubmitEvent = eventType === "tokenize" || eventType === "saveCard";
        const isSamePK = data?.publicKey === configProps.publicKey;
        const customerId = configProps.paymentOptions?.customer ?? "";
        const shouldCreateToken = isAllInputsValid && isSubmitEvent && isSamePK;
        const isScopeToken = scope === Scope.TOKEN;
        const isClick2payActive =
            clickToPay?.enabled &&
            clickToPay?.fired &&
            configProps.integration === Integration.CHECKOUT;

        if (!shouldCreateToken) {
            if (eventType === Events.TOKENIZE) {
                dispatch(setHideSavedCardForLoading(false));
            }
            return;
        }

        try {
            if (isClick2payActive) {
                const isLoaded = await loadScr(clickToPay?.url).catch((error) => {
                    sendEventGeneric(eventOrigin, {
                        event: Events.CLICK_2_PAY,
                        data: {
                            isLoaded: false,
                            error,
                        },
                    });
                    return false;
                });

                if (!isLoaded) return;

                const encryptionResult = await encrypt({
                    cardNumber: cardValue,
                    cvv: cvvValue,
                    date: dateValue,
                });
                sendEventGeneric(eventOrigin, {
                    event: Events.CLICK_2_PAY,
                    data: {
                        ...encryptionResult,
                    },
                });
                return;
            }

            const isSaveCardSwitchVisible =
                configProps.paymentOptions?.saveCardOption !== "none";
            const isSavePurpose =
                authentication?.authentication?.purpose === Purpose.SAVE_TOKEN;
            if (
                isSaveCardSwitchVisible &&
                isSavePurpose &&
                saveCardForLater === false
            ) {
                // eslint-disable-next-line
                throw {
                    message: "The customer has to agree to save the card",
                    code: 400,
                };
            }

            let tokenReceived: TokenTypeI | null = null;
            const startTokenization = async (
                payload: () => Promise<TokenTypeI>,
            ) => {
                startLoading();
                await sleep(Timeouts.TOKENIZATION_DELAY);
                const tokenReceived = await payload();
                return tokenReceived;
            };

            if (globalMode === "createToken") {
                tokenReceived = await startTokenization(() =>
                    API.tokenService.createToken({
                        cardValue,
                        dateValue,
                        cvvValue,
                        nameValue,
                        configProps,
                        encryptionKey,
                        refererUrl,
                        authentication,
                        scope,
                        saveCard: saveCardForLater,
                        isSaveCardSwitchVisible,
                        ip,
                    }),
                );
            } else if (loadedCard) {
                tokenReceived = await startTokenization(() =>
                    API.tokenService.createTokenSavedCard({
                        customer: customerId,
                        loadedCard,
                        configProps,
                        cvvValue,
                        encryptionKey,
                        refererUrl,
                        authentication,
                        ip,
                    }),
                );
            }

            if (tokenReceived) {
                isScopeToken && handleClearInputs();
                if (
                    eventType === Events.TOKENIZE &&
                    [Scope.AUTHENTICATED_TOKEN].includes(scope)
                ) {
                    const redirectObject =
                        await API.authenticationService.createAuthentication({
                            publicKey: configProps.publicKey,
                            authentication,
                            tokenResponse: tokenReceived,
                            ip,
                            saveCard: saveCardForLater,
                        });
                    const authUrl = redirectObject.authentication.url;
                    if (redirectObject.status === "INITIATED" && authUrl) {
                        dispatch(setAuthenticationURL(authUrl));
                    } else {
                        sendEventGeneric(refererUrl, {
                            event: Events.AUTHENTICATION,
                            data: { authentication: redirectObject },
                        });
                        sendEventGeneric(refererUrl, {
                            event: Events.LOADING_IFRAME,
                            data: false,
                        });
                        dispatch(setLoading(false));
                    }
                } else {
                    const redirectUrl = window.location.href;
                    sendEventGeneric(refererUrl, {
                        event: Events.LOADING_IFRAME,
                        data: false,
                    });
                    dispatch(setLoading(false));
                    sendEventGeneric(eventOrigin, {
                        event: Events.TOKEN,
                        data: { token: tokenReceived, redirectUrl },
                    });
                    sendEventGeneric(eventOrigin, {
                        event: Events.REDIRECT_URL,
                        data: { redirectUrl },
                    });
                    dispatch(setHideSavedCardForLoading(false));
                }
            }

        } catch (error) {
            dispatch(setLoading(false));
            sendEventGeneric(refererUrl, { event: Events.LOADING_IFRAME, data: false });
            sendEventGeneric(refererUrl, { event: Events.ERROR, data: error });
            dispatch(setHideSavedCardForLoading(false));
        }
    }

    return {
        handleTokenize
    }
}
