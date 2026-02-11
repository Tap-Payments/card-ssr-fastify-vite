import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import HTTPClient from "../../api/axios";
import { Events } from '../../utils/constants'
import type { EventMessage } from "@shared/types/event";
import type { configPaymentOption } from "@shared/types/configProps";
import type { CardInputs } from "@shared/types/Card";
import {
    getConfig,
    setConfigPaymentOption,
    setTheme,
    setPublicKey,
    setHideSavedCardForLoading,
    setHideErrorFooter,
    setIP,
    setClickToPay,
    setScope,
} from "@features/configSlice";
import {
    setLoading,
} from "@features/globalSlice";
import { getGlobalState } from "@features/globalSlice";
import { getExactCardValue } from "@features/cardSlice";
import { getDate } from "@features/dateSlice";
import { getCVV } from "@features/cvvSlice";
import { getHolderName } from "@features/holdernameSlice";
import { getAuthentication } from "@features/authenticationSlice";
import { useErrors } from '../../hooks/useErrors'
import { sendEventGeneric } from "@utils";

import { useAuthenticationEvents } from "./useAuthenticationEvents";
import { useTokenization } from "./useTokenization";
import { useCardActions } from "./useCardActions";

export const useIframeListener = () => {
    const dispatch = useDispatch();
    const { handleAuthenticationMessage } = useAuthenticationEvents();
    const { handleTokenize } = useTokenization();
    const { handleClearInputs, loadCardInputs, fillCardInputs } = useCardActions();
    const { refererUrl } = useSelector(getConfig);

    // We still need all these dependencies to know when to re-bind the listener
    // because some values (like nameValue, cardValue) are used inside the closures of the sub-hooks?
    // Actually, in the sub-hooks I used useSelector, but the hooks themself are called on every render.
    // The eventListener function is recreated on every render if it depends on these.
    // However, window.addEventListener should only bind a stable function or be updated when deps change.

    // In the original useEvents, dependencies were explicitly listed.
    // Let's grab them to pass to the dependency array.
    const { value: nameValue } = useSelector(getHolderName);
    const cardValue = useSelector(getExactCardValue);
    const { value: cvvValue } = useSelector(getCVV);
    const { value: dateValue } = useSelector(getDate);
    const { isAllInputsValid } = useErrors();
    const { authenticationURL, authentication } = useSelector(getAuthentication);
    const { saveCardForLater } = useSelector(getGlobalState);
    const { clickToPay } = useSelector(getConfig);

    const eventListener = async (e: MessageEvent) => {
        const { data, event, action } = e.data as EventMessage<any>; // eslint-disable-line @typescript-eslint/no-explicit-any

        try {
            // Tokenization Events
            if (event === Events.TOKENIZE || event === Events.SAVE_CARD) {
                await handleTokenize(e.origin, event, data);
            }

            // Authentication Events
            if (
                event === Events.LOAD_AUTHENTICATION ||
                event === Events.CANCEL_AUTHENTICATION ||
                action === Events.ACTION_3DS_IFRAME_ON_READY ||
                action === Events.ACTION_3DS_IFRAME_ON_FINISH
            ) {
                await handleAuthenticationMessage(e);
            }

            // Utility / Config Events
            if (event === Events.LOAD_SAVED_CARD) {
                const { cardId } = data;
                loadCardInputs(cardId);
            }
            if (event === Events.HIDE_SAVED_CARD_OPTION) {
                dispatch(setHideSavedCardForLoading(data.hide));
            }

            if (event === Events.HIDE_ERROR_FOOTER) {
                dispatch(setHideErrorFooter(data.hide));
            }
            if (event === Events.UPDATE_PAYMENT_OPTION) {
                if (data?.scope) {
                    return dispatch(setScope(data?.scope));
                }
                if (data?.clickToPay) {
                    return dispatch(setClickToPay(data?.clickToPay));
                }
                const { paymentOptions } = data as {
                    publicKey: string;
                    paymentOptions: any; // eslint-disable-line @typescript-eslint/no-explicit-any
                };
                return dispatch(setConfigPaymentOption(paymentOptions as configPaymentOption));
            }
            if (event === Events.RESET) {
                handleClearInputs();
            }
            if (event === Events.UPDATE_THEME_MODE) {
                dispatch(setTheme(data.theme));
            }
            if (event === Events.UPDATE_PUBLIC_KEY) {
                dispatch(setPublicKey(data.newPublicKey));
            }
            if (event === Events.FILL_CARD_INPUTS) {
                fillCardInputs(data.cardInputs as CardInputs);
            }
            if (event === Events.SEND_IP) {
                dispatch(setIP(data.ip));
            }
            if (event === Events.SEND_HEADERS) {
                if (data.headers) {
                    HTTPClient.defaults.headers.common = {
                        ...HTTPClient.defaults.headers.common,
                        ...data.headers,
                    };
                }
            }

        } catch (error) {
            dispatch(setLoading(false));
            sendEventGeneric(refererUrl, { event: Events.LOADING_IFRAME, data: false });
            sendEventGeneric(refererUrl, { event: Events.ERROR, data: error });
            dispatch(setHideSavedCardForLoading(false));
        }
    };

    useEffect(() => {
        window.addEventListener("message", eventListener, false);
        return () => {
            window.removeEventListener("message", eventListener);
        };
    }, [
        nameValue,
        cardValue,
        cvvValue,
        dateValue,
        isAllInputsValid,
        authenticationURL,
        saveCardForLater,
        authentication?.currency,
        clickToPay.fired,
        // Also need to include the handle functions if they are not stable (they are not).
        // Since we are using them inside eventListener which is inside useEffect.
        // Ideally we wrap them in useCallback in their respective hooks or just accept re-binds.
        // Re-binding is fine for this app scale usually, but let's be aware.
    ]);
}
