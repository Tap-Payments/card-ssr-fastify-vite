import { AxiosError } from "axios";
import HTTPClient, { BackendAPIError } from "./HTTPClient.js";
import { generateHTTPOptions } from '../utils/generateHTTPOptions.js';
const getTransaction = async (key: string, id: string, object: string) => {
  const options = generateHTTPOptions({
    publicKey: key,
  });

  try {
    const res = await HTTPClient.get(
      `/${object === "authorize" ? "authorize" : "charges"}/${id}`,
      options
    );
    return res;
  } catch (error: unknown | AxiosError<BackendAPIError>) {
    const err = error as AxiosError<BackendAPIError>;

    return Promise.reject(err);
  }
};

const transactionService = {
  getTransaction,
};

export { transactionService };
