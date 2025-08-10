import { useCallback } from "react";

interface CardData {
  cardNumber: string;
  cvv: string;
  date: string;
}

const SCRIPT_ID = "c2p-script";
const CUSTOM_C2P_ERROR_NAME = "click2PayError";

export const useC2P = () => {
  const loadScr = useCallback((url: string) => {
    return new Promise((resolve, reject) => {
      if (!url) {
        reject({
          name: CUSTOM_C2P_ERROR_NAME,
          reason: "C2P Script URL is not provided!",
        });
        return;
      }
      const isExist = document.getElementById(SCRIPT_ID);
      if (isExist) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = url;
      script.async = true;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        reject({
          name: CUSTOM_C2P_ERROR_NAME,
          reason: "C2P Url is failed to load!",
        });
      };
      document.body.appendChild(script);
    });
  }, []);

  const encrypt = useCallback(async ({ cardNumber, cvv, date }: CardData) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { MastercardCheckoutServices } = window as any;
    try {
      if (!MastercardCheckoutServices) {
        // eslint-disable-next-line no-throw-literal
        throw {
          reason: "MastercardCheckoutServices is not defined",
          name: "MastercardCheckoutServices",
        };
      }

      const [panExpirationMonth, panExpirationYear] = date.split("/");

      const cardData = {
        cardSecurityCode: cvv,
        primaryAccountNumber: cardNumber,
        panExpirationMonth,
        panExpirationYear,
      };
      const mcInstance = new MastercardCheckoutServices();
      const { encryptedCard, cardBrand } =
        await mcInstance.encryptCard(cardData);
      return { encryptedCard, cardBrand };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return {
        error: {
          name: error.name,
          reason: error.reason ?? error.message,
        },
      };
    }
  }, []);

  return { loadScr, encrypt };
};
