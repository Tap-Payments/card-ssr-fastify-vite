import { Timeouts, Events } from '../../utils/constants'

// Note: I will replace the imports and the body content. Assuming this is fine. I'll include the necessary existing imports.
import { useDispatch, useSelector } from 'react-redux'
import API from '../../api'
import { sendEventGeneric } from '@utils'
import { Integration } from '@shared/types'
import {
    getConfig,
    setHideSavedCardForLoading,
} from '@features/configSlice'
import {
    setLoading,
} from '@features/globalSlice'
import {
    getAuthentication,
    setAuthenticationURL,
    setShowAuthenticationIframe,
    setIs3DsActive,
    setFinishAuthenticationIframe,
    resetAuthentication
} from '@features/authenticationSlice'
import { useCardActions } from './useCardActions'
import type { EventMessage } from "@shared/types/event";

export const useAuthenticationEvents = () => {
    const dispatch = useDispatch()
    const { handleClearInputs } = useCardActions()

    // Selectors
    const {
        config: configProps,
        refererUrl,
        powered
    } = useSelector(getConfig)

    const { authenticationURL } = useSelector(getAuthentication)

    const handleAuthenticationMessage = async (event: MessageEvent) => {
        const { data, event: eventType, action } = event.data as EventMessage<any>; // eslint-disable-line @typescript-eslint/no-explicit-any

        try {
            if (eventType === Events.LOAD_AUTHENTICATION && data.authenticationUrl) {
                sendEventGeneric(refererUrl, {
                    event: Events.THREE_DS_REDIRECT,
                    data: { threeDsRedirect: false },
                });
                const { authenticationUrl: authUrlFromData } = data;
                const authenticationId = new URLSearchParams(
                    authUrlFromData.split("?")[1],
                ).get("auth_payer") as string;
                const authentication =
                    await API.authenticationService.getAuthentication({
                        authId: authenticationId,
                        publicKey: configProps.publicKey,
                    });
                handleClearInputs();
                sendEventGeneric(refererUrl, {
                    event: Events.AUTHENTICATION,
                    data: { authentication },
                });
                sendEventGeneric(refererUrl, { event: Events.LOADING_IFRAME, data: false });
                dispatch(setLoading(false));
                dispatch(resetAuthentication());
            }

            if (eventType === Events.CANCEL_AUTHENTICATION) {
                dispatch(setLoading(false));
                sendEventGeneric(refererUrl, { event: Events.LOADING_IFRAME, data: false });
                dispatch(setHideSavedCardForLoading(false));
            }

            if (action === Events.ACTION_3DS_IFRAME_ON_READY) {
                sendEventGeneric(refererUrl, {
                    event: Events.ON_3DS_REDIRECT,
                    data: {
                        threeDsUrl: authenticationURL,
                        redirectUrl: window.location.origin,
                        keyword: "auth_payer",
                        powered,
                    },
                });
                sendEventGeneric(refererUrl, {
                    event: Events.THREE_DS_REDIRECT,
                    data: { threeDsRedirect: true },
                });
                if (configProps.integration === Integration.WEBVIEW) {
                    dispatch(setAuthenticationURL(undefined));
                    return;
                }
                dispatch(setShowAuthenticationIframe(true));
                setTimeout(() => {
                    dispatch(setIs3DsActive(true));
                }, Timeouts.THREE_DS_ACTIVE_DELAY);
                setTimeout(() => {
                    sendEventGeneric(refererUrl, { event: Events.LOADING_IFRAME, data: false });
                    dispatch(setLoading(false));
                }, Timeouts.LOADING_IFRAME_HIDE_DELAY);
            }

            if (action === Events.ACTION_3DS_IFRAME_ON_FINISH && data) {
                dispatch(setLoading(true));
                sendEventGeneric(refererUrl, { event: Events.LOADING_IFRAME, data: true });
                dispatch(setFinishAuthenticationIframe(true));
                sendEventGeneric(refererUrl, { event: Events.ON_3DS_FINISH, data: true });

                setTimeout(() => {
                    dispatch(setIs3DsActive(false));
                }, Timeouts.THREE_DS_INACTIVE_DELAY);

                setTimeout(() => {
                    dispatch(setFinishAuthenticationIframe(false));
                    dispatch(setShowAuthenticationIframe(false));
                    sendEventGeneric(refererUrl, {
                        event: Events.THREE_DS_REDIRECT,
                        data: { threeDsRedirect: false },
                    });
                }, Timeouts.AUTH_FINISH_DELAY);

                setTimeout(async () => {
                    const authenticationId = new URLSearchParams(data.split("?")[1]).get(
                        "auth_payer",
                    );
                    const authentication =
                        await API.authenticationService.getAuthentication({
                            authId: authenticationId!,
                            publicKey: configProps.publicKey,
                        });
                    handleClearInputs();
                    sendEventGeneric(refererUrl, {
                        event: Events.AUTHENTICATION,
                        data: { authentication },
                    });
                    sendEventGeneric(refererUrl, { event: Events.LOADING_IFRAME, data: false });
                    dispatch(setLoading(false));
                    dispatch(resetAuthentication());
                }, Timeouts.AUTH_RESULT_FETCH_DELAY);
            }

        } catch (error) {
            dispatch(setLoading(false));
            sendEventGeneric(refererUrl, { event: Events.LOADING_IFRAME, data: false });
            sendEventGeneric(refererUrl, { event: Events.ERROR, data: error });
            dispatch(setHideSavedCardForLoading(false));
        }
    }

    return {
        handleAuthenticationMessage
    }
}
