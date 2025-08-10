import type { CURRENCIES } from "@shared/types/paymentOption";

export const isSupportedCurrency = ({
  currencyCode,
  supportedCurrencies,
}: {
  currencyCode: string | string[];
  supportedCurrencies: CURRENCIES[];
}): boolean => {
  if (
    typeof currencyCode === "string" &&
    currencyCode?.toUpperCase() === "ALL"
  ) {
    return true;
  }
  if (typeof currencyCode === "string") {
    return supportedCurrencies.includes(currencyCode as CURRENCIES);
  }
  if (Array.isArray(currencyCode)) {
    return (
      supportedCurrencies.filter((item) => currencyCode?.includes(item))
        .length > 0
    );
  }
  return false;
};
