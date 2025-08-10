import { sendEventGeneric } from "@utils";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { getConfig } from "@features/configSlice";
import { useErrors } from "./useErrors";
import { CardEvent } from "@shared/types/Card";

export const useValidatePost = () => {
  const {
    isAllInputsValid,
    isAnyError,
    isCreditCardError,
    isExpireDateError,
    isCVVError,
    isCardHolderValid,
    isHolderError,
    creditCardErrorText,
    expireDateErrorText,
    cvvErrorText,
    holderErrorText,
    isInCardSupported,
    isCVVCompleteTyping,
    isExpireDateCompleteTyping,
    isCreditCardCompleteTyping,
    isHolderCompleteTyping,
  } = useErrors();
  const { refererUrl: url } = useSelector(getConfig);
  useEffect(() => {
    const event: CardEvent = {
      isAllInputsValid,
      cvv: {
        errorMessage: cvvErrorText,
        isValid: !isCVVError,
        isUserDoneTyping: isCVVCompleteTyping,
      },
      date: {
        errorMessage: expireDateErrorText,
        isValid: !isExpireDateError,
        isUserDoneTyping: isExpireDateCompleteTyping,
      },
      name: {
        errorMessage: holderErrorText,
        isValid: !isHolderError,
        isUserDoneTyping: isHolderCompleteTyping,
      },
      number: {
        errorMessage: creditCardErrorText,
        isValid: !isCreditCardError,
        isUserDoneTyping: isCreditCardCompleteTyping,
      },
    };
    sendEventGeneric(url, { event: "cardInputs", data: event });
  }, [
    isAllInputsValid,
    isAnyError,
    isCreditCardError,
    isExpireDateError,
    isCVVError,
    isCardHolderValid,
    isHolderError,
    creditCardErrorText,
    expireDateErrorText,
    cvvErrorText,
    holderErrorText,
    isInCardSupported,
    isCVVCompleteTyping,
    isExpireDateCompleteTyping,
    isCreditCardCompleteTyping,
    isHolderCompleteTyping,
  ]);
};
