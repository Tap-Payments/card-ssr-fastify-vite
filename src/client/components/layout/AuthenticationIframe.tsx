import React, { FC } from 'react'


interface AuthenticationIframeProps {
    is3DsActive: boolean
    height3DS: number
    inputsContainerHeight?: number
    hideCardFor3ds: boolean
    showAuthenticationIframe: boolean
    finishAuthenticationIframe: boolean
    showCardHolderName: boolean
    starterBorderRadius: string
    borderRadius: string
    authenticationURL?: string
    version: string
    backgroundColor: string
    boxShadow: string
}

const AuthenticationIframe: FC<AuthenticationIframeProps> = ({
    is3DsActive,
    height3DS,
    inputsContainerHeight,
    showAuthenticationIframe,
    finishAuthenticationIframe,
    showCardHolderName,
    starterBorderRadius,
    borderRadius,
    authenticationURL,
    version,
    backgroundColor,
    boxShadow
}) => {
    return (
        <div
            data-src='jscard-node-mw'
            data-testid='tap-authentication'
            style={{
                margin: 8,
                backgroundColor,
                height: is3DsActive ? height3DS - 16 : inputsContainerHeight,
                opacity: showAuthenticationIframe || finishAuthenticationIframe ? 1 : 0,
                boxShadow,
                borderRadius: finishAuthenticationIframe && !showCardHolderName ? starterBorderRadius : borderRadius,
                width: 'calc(100% - 16px)',
                position: 'absolute',
                overflow: 'hidden',
                transition: finishAuthenticationIframe
                    ? 'all 0.5s ease-in-out, border-radius 0.5s ease-in-out'
                    : 'all 0.6s ease-in-out',
                zIndex: showAuthenticationIframe ? 2 : 1
            }}
        >
            <iframe
                id='tap-card-iframe-authentication'
                data-src='jscard-node-mw'
                name='tapFrame'
                title='Secure payment input'
                width='100%'
                height='100%'
                allowFullScreen={true}
                referrerPolicy='origin'
                data-version={version}
                // data-version-sdk={sdkVersion}
                frameBorder='0'
                style={{
                    border: 'none',
                    opacity: showAuthenticationIframe && !finishAuthenticationIframe ? 1 : 0,
                    padding: '0',
                    overflow: 'block',
                    transition:
                        showAuthenticationIframe && !finishAuthenticationIframe
                            ? 'opacity 0s ease-out 1.2s, border-radius 0.5s ease-in-out'
                            : '',
                    borderRadius: finishAuthenticationIframe && !showCardHolderName ? starterBorderRadius : borderRadius
                }}
                src={authenticationURL}
            />
        </div>
    )
}

export default React.memo(AuthenticationIframe)
