import React, { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { getConfig } from "@features/configSlice";
import { getGlobalState } from "@features/globalSlice";
import { sendEventGeneric } from "@utils";
import { getAuthentication } from "@features/authenticationSlice";
import { THREE_DS_HEIGHT } from "@shared/config/constant";

const CardElementId = "card-main-container";
const cardInputs = "card-inputs-container";
export const useDimensionEvent = () => {
  const ref = React.useRef<any>(null);
  const { refererUrl, authentication } = useSelector(getConfig);
  const { threeDsHeight } = useSelector(getGlobalState);
  const { is3DsActive } = useSelector(getAuthentication);
  const height3DS = useMemo(
    () => authentication?.height3DS || THREE_DS_HEIGHT,
    [authentication],
  );

  const calculateTotalHeight = () => {
    const cardElement = document.getElementById(CardElementId);
    if (cardElement) {
      const { height } = cardElement.getBoundingClientRect();
      return parseInt((height + 16 || 104).toString());
    }
    return 0;
  };
  const calculateCardInputsHeight = () => {
    const cardInputsElement = document.getElementById(cardInputs);
    if (cardInputsElement) {
      const { height } = cardInputsElement.getBoundingClientRect();
      return parseInt((height || 104).toString());
    }
    return 0;
  };

  useEffect(() => {
    if (is3DsActive === undefined) return;
    const calcHeight = calculateTotalHeight();
    const calcCardInputsHeight = calculateCardInputsHeight();
    sendEventGeneric(refererUrl, {
      event: "dimension",
      data: {
        height: is3DsActive ? height3DS : calcHeight,
        inputsHeight: is3DsActive ? height3DS - 16 : calcCardInputsHeight,
      },
    });
  }, [is3DsActive, height3DS]);

  useEffect(() => {
    const calcHeight = calculateTotalHeight();
    const calcCardInputsHeight = calculateCardInputsHeight();
    ref.current = { height: calcHeight, inputsHeight: calcCardInputsHeight };
    const interval = setInterval(() => {
      const h = threeDsHeight ?? calculateTotalHeight();
      const inputsH = calculateCardInputsHeight();
      const storedH = ref.current || {};

      if (h !== storedH.height || inputsH !== storedH.inputsHeight) {
        ref.current = { height: h, inputsHeight: inputsH };
        sendEventGeneric(refererUrl, {
          event: "dimension",
          data: {
            height: h,
            inputsHeight: inputsH,
          },
        });
      }
    }, 50);
    return () => clearInterval(interval);
  }, [threeDsHeight, refererUrl]);
};
