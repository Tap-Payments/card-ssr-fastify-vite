import { AxiosError } from 'axios';

import HTTPClient, { BackendAPIError } from './HTTPClient.js';
import { generateHTTPOptions } from '../utils/generateHTTPOptions.js';
const getAuthenticate = async (key: string, authenticateId: string) => {
  const options = generateHTTPOptions({
    publicKey: key,
  });

  try {
    const res = await HTTPClient.get(`/authenticate/${authenticateId}`, options);
    return res;
  } catch (error: unknown | AxiosError<BackendAPIError>) {
    const err = error as AxiosError<BackendAPIError>;

    return Promise.reject(err);
  }
};

const createAuthenticate = async (key: string, request: object) => {
  const options = generateHTTPOptions({
    publicKey: key,
  });

  try {
    const res = await HTTPClient.post(`/authenticate`, request, options);
    return res;
  } catch (error: unknown | AxiosError<BackendAPIError>) {
    const err = error as AxiosError<BackendAPIError>;

    return Promise.reject(err);
  }
};

const authenticateService = {
  createAuthenticate,
  getAuthenticate,
};

export { authenticateService };
