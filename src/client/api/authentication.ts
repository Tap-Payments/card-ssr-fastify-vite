import { AxiosError, AxiosRequestConfig } from "axios";
import { configProps } from "@shared/types/configProps";
import HTTPClient, { BackendError } from "./axios";

import { AuthenticationResponse } from "@shared/types/Authentication";
import { mapCustomerToApi } from "../utils/token";

type CreateAuthenticationProps = {
  publicKey: string;
  authentication: configProps["authentication"];
  tokenResponse: {
    id: string;
    order?: object;
    customer?: object;
    payment_agreement?: object;
    merchant?: object;
  };
  axiosConfig?: AxiosRequestConfig;
  ip?: string;
  saveCard?: boolean;
};

const createAuthentication = async ({
  publicKey,
  authentication,
  tokenResponse,
  axiosConfig,
  ip,
  saveCard,
}: CreateAuthenticationProps): Promise<AuthenticationResponse> => {
  const obj = {
    amount: authentication?.amount,
    currency: authentication?.currency,
    save_card: !!saveCard,
    description: authentication?.description,
    reference: authentication?.reference,
    invoice: authentication?.invoice,
    customer:
      tokenResponse.customer ?? mapCustomerToApi(authentication?.customer),
    payment_agreement:
      tokenResponse.payment_agreement ?? authentication?.paymentAgreement,
    device: {
      ...authentication?.device,
      ipAddress: ip,
    },
    source: {
      id: tokenResponse.id,
    },
    authentication: authentication?.authentication,
    merchant: tokenResponse.merchant || authentication?.merchant,
    metadata: authentication?.metadata,
    airline: authentication?.airline,
    post: authentication?.post,
    redirect: {
      url: window.location.origin,
    },
    ...((authentication?.id || authentication?.mode) && {
      transaction: {
        id: authentication?.id,
        type: authentication?.mode?.toLocaleUpperCase(),
      },
    }),
  };

  const options: AxiosRequestConfig = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${publicKey}`,
    },
    ...axiosConfig,
  };

  try {
    const res = await HTTPClient.post("/authenticate", obj, options);
    return res.data as AuthenticationResponse;
  } catch (error: unknown | AxiosError<BackendError>) {
    const err = error as AxiosError<BackendError>;
    const AUTH_ERROR: BackendError = {
      statusCode: err.response!.status,
      error: err.code!,
      message: err.message,
    };
    return Promise.reject(AUTH_ERROR);
  }
};

const getAuthentication = async ({
  authId,
  publicKey,
  axiosConfig,
}: {
  authId: string;
  publicKey: string;
  axiosConfig?: AxiosRequestConfig;
}): Promise<AuthenticationResponse> => {
  const options: AxiosRequestConfig = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${publicKey}`,
    },
    ...axiosConfig,
  };

  try {
    const res = await HTTPClient.get(`/authenticate/${authId}`, options);
    return res.data as AuthenticationResponse;
  } catch (error: unknown | AxiosError<BackendError>) {
    const err = error as AxiosError<BackendError>;
    const AUTH_ERROR: BackendError = {
      statusCode: err.response!.status,
      error: err.code!,
      message: err.message,
    };
    return Promise.reject(AUTH_ERROR);
  }
};

const authenticationService = {
  createAuthentication,
  getAuthentication,
};

export { authenticationService };
