import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { CreditCardTypeSecurityCodeLabel } from "@shared/types/cardtypeI";
import { getConfig } from "@features/configSlice";
import {
  getCard,
  setBIN,
  setBIN_LOCKED,
  setCardValue,
  setIsInEnglish,
  setType,
} from "@features/cardSlice";
import {
  allCharsInEN,
  getCardType,
  maskStringFromCardNumber,
  removeWhitespaces,
  sendEventGeneric,
} from "@utils";
import { setCvvLabelAndSize } from "@features/cvvSlice";
import { isValidString } from "@utils";
import API from "../api";
import { CREDIT_CARD_NUMBER } from "@shared/config/constant";
import { CardFundingSource, configPaymentOption } from "@shared/types";
import { useTranslation } from "react-i18next";
import { resetDate } from "@features/dateSlice";

const fundingSourceToTranslationKey = Object.freeze({
  [CardFundingSource.ALL]: "",
  [CardFundingSource.CREDIT]: "TapCardInputKit.credit",
  [CardFundingSource.DEBIT]: "TapCardInputKit.debit",
});

export const useCardNumber = () => {
  const [mask, setMask] = useState<string>(CREDIT_CARD_NUMBER.defaultMask);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { refererUrl, config } = useSelector(getConfig);
  const { BIN, BIN_LOCKED } = useSelector(getCard);

  const { paymentOptions = {} as configPaymentOption } = config || {};

  const { cardFundingSource } = paymentOptions;

  const placeholder = useMemo(() => {
    const fsTranslationKey =
      cardFundingSource && cardFundingSource in fundingSourceToTranslationKey
        ? fundingSourceToTranslationKey[cardFundingSource]
        : fundingSourceToTranslationKey[CardFundingSource.ALL];

    return t("TapCardInputKit.enterCardLabel").replace(
      "%@",
      t(fsTranslationKey),
    );
  }, [t, cardFundingSource]);

  const onChangeCardNumber = async (value: string) => {
    // max allowed card number length is 16 "only take first 16"
    const valueTrimmed = removeWhitespaces(value).substring(
      0,
      CREDIT_CARD_NUMBER.maxAllowedLength,
    );
    if (valueTrimmed) dispatch(setIsInEnglish(allCharsInEN(valueTrimmed)));
    dispatch(setCardValue(valueTrimmed));

    if (!valueTrimmed || valueTrimmed === "") {
      const card = getCardType(valueTrimmed);
      dispatch(setType(card));
      dispatch(resetDate());
      return false;
    }

    const card = getCardType(valueTrimmed);
    if (card?.type) {
      const updatedMask = maskStringFromCardNumber({
        gaps: card.type.gaps,
        lengths: card.type.lengths,
      });
      setMask(updatedMask);

      dispatch(setType(card));
      // set CVV Label and size
      dispatch(
        setCvvLabelAndSize({
          label: card.type.code.name as CreditCardTypeSecurityCodeLabel,
          size: card.type.code.size,
        }),
      );
    }

    if (valueTrimmed.length > 9 && !valueTrimmed.startsWith("0")) {
      if (BIN_LOCKED === false) {
        if (BIN?.bin === valueTrimmed.substring(0, 10)) {
          return false;
        }
        dispatch(setBIN_LOCKED(true));
        //
        try {
          const data = await API.cardService.getBIN({
            binValue: valueTrimmed,
            configProps: config,
            refererUrl,
          });
          const isValidCardBrand = isValidString(data.card_brand);
          const isValidSchema = isValidString(data.card_scheme);
          if (!isValidCardBrand || !isValidSchema)
            return dispatch(setCardValue(""));

          sendEventGeneric(refererUrl, { event: "bin", data: { bin: data } });
          dispatch(setBIN(data as any));
          // eslint-disable-next-line
        } catch {
          // TODO: handle cardService.getBIN error.
        }
        //
        dispatch(setBIN_LOCKED(false));
      }
    }
  };

  return {
    onChangeCardNumber,
    mask,
    setMask,
    placeholder,
  };
};
