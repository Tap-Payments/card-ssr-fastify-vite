import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  getCard,
  setIsValid,
  setIsUserDoneTyping,
  setMode,
} from "../../../../features/cardSlice";
import {
  getCardType,
  maskStringFromCardNumber,
} from "../../../../utils/cardHandler";
import { getConfig } from "../../../../features/configSlice";
import { sendEventGeneric } from "../../../../utils/event";
import { useErrors, useLocale } from "../../../../hooks";
import { useCardNumber } from "../../../../hooks/useCardNumber";
import { useInputStyle } from "../../../../hooks/useInputStyle";
import { resetCVV } from "../../../../features/cvvSlice";
import { resetDate } from "../../../../features/dateSlice";
import focusElementByRefiOS from "../../../../utils/focusElement";
import { removeWhitespaces } from "../../../../utils";
import { useMask, format } from "@react-input/mask";

export function useCreditCard() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { isFundingSourceValid } = useErrors();
  const { refererUrl } = useSelector(getConfig);
  const { direction } = useLocale();
  const style = useInputStyle();
  const { onChangeCardNumber, mask, setMask, placeholder } = useCardNumber();
  const {
    value: cardValue,
    type: cardType,
    isValid: cardValid,
    isPotentiallyValid: isPotentialCardValid,
    trimmedValue,
    isUserDoneTyping,
    mode: formMode,
  } = useSelector(getCard);

  const maskOptions = useMemo(
    () => ({
      mask,
      replacement: { _: /\d/ },
    }),
    [mask],
  );
  const formattedCardValue = useMemo(
    () => format(cardValue || "", maskOptions),
    [maskOptions, cardValue],
  );
  const cardRef = useMask(maskOptions);

  const validate = () => {
    const eventData = {
      number: {
        isValid: cardValid,
        isUserDoneTyping,
        errorMessage: "",
      },
    };
    if (cardValue === "") {
      eventData.number.errorMessage = "Card Number Required";
    }
    if (isUserDoneTyping === true) {
      if (
        isPotentialCardValid === false ||
        (cardType?.lengths &&
          cardType.lengths.length > 0 &&
          cardValid === false &&
          trimmedValue.length === cardType.lengths[0])
      ) {
        eventData.number.errorMessage = "Invalid Card Number";
      } else {
        eventData.number.errorMessage = "";
      }
    }

    if (isUserDoneTyping !== true && isPotentialCardValid === false) {
      eventData.number.errorMessage = "Invalid Card Number";
    }

    if (isUserDoneTyping === true && cardValid === false) {
      eventData.number.errorMessage = "Invalid Card Number";
    }
    sendEventGeneric(refererUrl, { event: "cardInputs", data: eventData });
  };

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const formattedValue = value.replace(" ", "");
    onChangeCardNumber(formattedValue);
  };

  const onPasteHandler = () => {
    dispatch(resetCVV());
    dispatch(resetDate());
  };

  const onClickHandler = (
    event: React.MouseEvent<HTMLInputElement, MouseEvent>,
  ) => {
    const value_length = cardRef.current?.value.trim().length as number | null;
    if (!value_length) return;
    const target = event.target as HTMLInputElement;
    const selectionStart = target.selectionStart;

    if (selectionStart && value_length) {
      if (selectionStart > value_length && cardRef.current) {
        target.selectionStart = cardRef.current?.value.trim().length;
        target.selectionEnd = cardRef.current?.value.trim().length;
      }
    }
  };

  const switchToRight = () => {
    if (cardValue.length === 0 || cardValid) dispatch(setMode("right"));
  };

  const handlePasteAnywhere = (event: any) => {
    const hasClass = event.target?.classList?.contains("cardinput_class");

    const card = getCardType(event.target?.value);
    if (card?.type) {
      // updateUserDoneTyping(event.target?.value.length);

      if (hasClass === true) {
        const mask = maskStringFromCardNumber({
          gaps: card.type.gaps,
          lengths: card.type.lengths,
        });
        setMask(mask);
      }
    }
  };
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (cardRef.current?.name === "card_input") {
      const expireDateInput = document.getElementById(
        "date_input",
      ) as HTMLElement;
      const { isValid } = getCardType(trimmedValue);

      if (cardType?.lengths && cardType.lengths.length > 0) {
        if (isValid && isFundingSourceValid) {
          dispatch(setIsValid(true));
          dispatch(setMode("right"));
          if (expireDateInput !== null) {
            timeout = focusElementByRefiOS(expireDateInput, 10);
          }
        } else {
          dispatch(setIsValid(false));
          dispatch(setMode("left"));
        }
      }
    }
    window.addEventListener("paste", handlePasteAnywhere);
    return () => {
      window.removeEventListener("paste", handlePasteAnywhere);
      clearTimeout(timeout);
    };
  }, [mask, cardValue]);
  useEffect(() => {
    validate();
  }, [cardValid, isPotentialCardValid, cardType, isUserDoneTyping]);

  useEffect(() => {
    if (formMode === "left") {
      cardRef.current?.focus();
    }
  }, [formMode]);

  function isCardNumberError() {
    if (isPotentialCardValid === false) {
      return true;
    }
    if (cardType?.lengths && cardType.lengths.length > 0) {
      if (cardValid === false && trimmedValue.length === cardType.lengths[0]) {
        return true;
      }
    }
    return false;
  }

  // setIsUserDoneTyping(true) if the user is done typing onKeyUp.
  // setIsUserDoneTyping(false) if the user is not done typing onKeyUp.
  const updateUserDoneTyping = React.useCallback(
    (trimmedInputLength: number) => {
      const trimmedMaskLength = removeWhitespaces(mask).length;
      const updateUserDoneTypingCondition: boolean =
        trimmedMaskLength - trimmedInputLength <= 1;
      if (updateUserDoneTypingCondition) {
        dispatch(setIsUserDoneTyping(true));
      }
    },
    [mask],
  );

  const onKeyHandler = React.useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      const trimmedInputLength = removeWhitespaces(
        event.currentTarget.value,
      ).length;
      if (event.key === "Backspace") {
        dispatch(setIsUserDoneTyping(false));
      } else {
        updateUserDoneTyping(trimmedInputLength);
      }
    },
    [cardValue],
  );

  return {
    t,
    mask,
    cardRef,
    style,
    direction,
    cardValue,
    formMode,
    onChangeHandler,
    onPasteHandler,
    onClickHandler,
    switchToRight,
    onKeyHandler,
    isCardNumberError,
    placeholder,
    formattedCardValue,
  };
}
