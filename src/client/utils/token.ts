import { cleanCountryCode } from "@utils";
import { Integration } from "@shared/types";
import type { Authentication } from "@shared/types/Authentication";
import { isFalsyOrEmptyObject } from "./object";
import { resetEmptyString } from "./string";
import packageJson from "../../../package.json";

export const mapCustomerToApi = (customer?: Authentication["customer"]) => {
  const phone = customer?.contact?.phone;
  return {
    ...customer,
    name_on_card: customer?.nameOnCard,
    nameOnCard: undefined,
    editable: undefined,
    email: resetEmptyString(customer?.contact?.email),
    ...(!isFalsyOrEmptyObject(phone) && {
      phone: {
        country_code: resetEmptyString(
          cleanCountryCode(phone?.countryCode ?? ""),
        ),
        number: resetEmptyString(phone?.number?.toString()),
      },
    }),
    name: customer?.name?.map((name) => ({
      first_name: resetEmptyString(name.first),
      last_name: resetEmptyString(name.last),
      middle_name: resetEmptyString(name.middle),
      locale: resetEmptyString(name.lang),
    })),
    ...(customer?.contact && {
      contact: {
        email: resetEmptyString(customer?.contact?.email),
        ...(!isFalsyOrEmptyObject(phone) && {
          phone: {
            country_code: resetEmptyString(
              cleanCountryCode(phone?.countryCode ?? ""),
            ),
            number: resetEmptyString(phone?.number?.toString()),
          },
        }),
      },
    }),
  };
};
export const isLiveEnvironment = (publicKey: string) =>
  publicKey.startsWith("pk_live");

export const mapOrderToApi = (authentication?: Authentication) => ({
  amount: authentication?.amount,
  currency: authentication?.currency,
  id: authentication?.order?.id,
  description: authentication?.description,
  metadata: authentication?.order?.metadata,
  reference: authentication?.order?.reference,
});

export const getConsentData = ({
  ip,
  integration,
  browserName,
}: {
  ip?: string;
  integration: Integration;
  browserName?: string;
}) => ({
  device: {
    source: integration === Integration.WEBVIEW ? "app" : "web",
    ip,
  },
  browser: {
    name: browserName,
    id: "",
  },
  app: {
    identifier: "card_sdk",
    name: "card_sdk",
    // version: packageJson.dependencies['@tap-payments/card-web'],
    iframe_version: packageJson.version,
    // sdk_version: packageJson.dependencies['@tap-payments/card-web']
  },
});
