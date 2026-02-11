import React from 'react'
import { AnimatePresence } from 'framer-motion'
import Animation from '../Animation'
import FirstTruthyOf from '../shared/FirstTruthyOf'
import Footer from './Footer'

interface FooterErrorSectionProps {
    hideErrorFooter: boolean
    isAnyError: boolean
    isInEnglish: boolean
    isCreditCardError: boolean
    isFundingSourceValid: boolean
    isCountryNotSupported: boolean
    isCardNumberFullWidth: boolean
    isExpireDateError: boolean
    isCVVError: boolean
    isHolderError: boolean
    notInEnglishErrorText: string | null
    creditCardErrorText: string | null
    isFundingSourceValidErrorMessage: string | null
    notSupportedCountryErrorText: string | null
    expireDateErrorText: string | null
    cvvErrorText: string | null
    holderErrorText: string | null
}

const FooterErrorSection: React.FC<FooterErrorSectionProps> = ({
    hideErrorFooter,
    isAnyError,
    isInEnglish,
    isCreditCardError,
    isFundingSourceValid,
    isCountryNotSupported,
    isCardNumberFullWidth,
    isExpireDateError,
    isCVVError,
    isHolderError,
    notInEnglishErrorText,
    creditCardErrorText,
    isFundingSourceValidErrorMessage,
    notSupportedCountryErrorText,
    expireDateErrorText,
    cvvErrorText,
    holderErrorText
}) => {
    return (
        <>
            <AnimatePresence initial={false} key='card-animate-presence-2'>
                {!hideErrorFooter &&
                    isAnyError &&
                    (!isInEnglish ? (
                        <Animation key={'animation-6'} duration={0.5} id='animation-1-6'>
                            <Footer isError={true} errorText={notInEnglishErrorText} style={{ height: 42 }} />
                        </Animation>
                    ) : (
                        <FirstTruthyOf>
                            {isCreditCardError && (
                                <Animation key={'animation-1'} duration={0.5} id='animation-1-0'>
                                    <Footer isError={true} errorText={creditCardErrorText} style={{ height: 42 }} />
                                </Animation>
                            )}
                            {!isFundingSourceValid && (
                                <Animation key={'animation-5'} duration={0.5} id='animation-1-4'>
                                    <Footer isError={true} errorText={isFundingSourceValidErrorMessage} style={{ height: 42 }} />
                                </Animation>
                            )}
                            {isCountryNotSupported && (
                                <Animation key={'animation-6'} duration={0.5} id='animation-1-6'>
                                    <Footer isError={true} errorText={notSupportedCountryErrorText} style={{ height: 42 }} />
                                </Animation>
                            )}
                        </FirstTruthyOf>
                    ))}
            </AnimatePresence>
            <AnimatePresence initial={false} key='card-animate-presence-3'>
                {isInEnglish && !(isCardNumberFullWidth || hideErrorFooter) && isAnyError && (
                    <>
                        {isExpireDateError && (
                            <Animation key={'animation-2'} duration={0.5} id='animation-1-1'>
                                <Footer isError={true} errorText={expireDateErrorText} style={{ height: 42 }} />
                            </Animation>
                        )}
                        {isCVVError && (
                            <Animation key={'animation-3'} duration={0.5} id='animation-1-2'>
                                <Footer isError={true} errorText={cvvErrorText} style={{ height: 42 }} />
                            </Animation>
                        )}
                        {isHolderError && (
                            <Animation key={'animation-4'} duration={0.5} id='animation-1-3'>
                                <Footer isError={true} errorText={holderErrorText} style={{ height: 42 }} />
                            </Animation>
                        )}
                    </>
                )}
            </AnimatePresence>
        </>
    )
}

export default React.memo(FooterErrorSection)
