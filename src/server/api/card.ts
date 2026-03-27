import type { AxiosError } from 'axios';
import type { BinTypeI } from '../../shared/types/BinTypeI.js'; // Update the path to the correct location
import HTTPClient, { type BackendAPIError } from './HTTPClient.js';
import { generateHTTPOptions } from '../utils/generateHTTPOptions.js';
const getBin = async (key: string, bin: string) => {
    const options = generateHTTPOptions({
      publicKey: key,
    });

  try {
    const res = await HTTPClient.get<BinTypeI>(`/bin/${bin}`, options);
    return res;
  } catch (error: unknown | AxiosError<BackendAPIError>) {
    const err = error as AxiosError<BackendAPIError>;

    return Promise.reject(err);
  }
};

const createToken = async (key: string, request: object) => {
  const options = generateHTTPOptions({
    publicKey: key,
  });

  try {
    console.log('request before calling token', JSON.stringify(request));
    const res = await HTTPClient.post(`/tokens`, request, options);
    return res;
  } catch (error: unknown | AxiosError<BackendAPIError>) {
    const err = error as AxiosError<BackendAPIError>;

    return Promise.reject(err);
  }
};


const cardService = {
  createToken,
  getBin,
};

export { cardService };
