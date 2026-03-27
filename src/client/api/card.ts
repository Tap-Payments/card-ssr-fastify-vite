import { AxiosError, AxiosRequestConfig } from "axios";
import HTTPClient, { BackendError } from "./axios";
import { BinTypeI } from "@shared/types/BinTypeI";
import { configProps } from "@shared/types/configProps";
import { removeWhitespaces } from "@utils";

type GetBINRes = BinTypeI;
type GetBINProps = {
  configProps: configProps;
  binValue: string;
  axiosConfig?: AxiosRequestConfig;
  refererUrl: string;
};

const getBIN = async ({
  binValue,
  configProps,
  axiosConfig,
}: GetBINProps): Promise<GetBINRes> => {
  const bin = removeWhitespaces(binValue).substring(0, 10);
  const options: AxiosRequestConfig = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${configProps.publicKey}`,
    },
    ...axiosConfig,
  };

  try {
    const res = await HTTPClient.get(`/bin/${bin}`, options);
    return res.data as GetBINRes;
  } catch (error: unknown | AxiosError<BackendError>) {
    const err = error as AxiosError<BackendError>;
    const BIN_ERROR: BackendError = {
      statusCode: err.response!.status,
      error: err.code!,
      message: err.message,
    };
    return Promise.reject(BIN_ERROR);
  }
};


const cardService = {
  getBIN,
};

export { cardService };
