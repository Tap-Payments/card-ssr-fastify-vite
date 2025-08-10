import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

const HTTPClient = axios.create({
  baseURL: `/v2/card`,
  headers: {
    "Content-Type": "application/json",
    // solve `chrome-only` Queueing of requests issue
    // src: https://stackoverflow.com/questions/27513994/chrome-stalls-when-making-multiple-requests-to-same-resource
    "Cache-Control": "no-cache, no-store, no-transform, must-revalidate",
    priority: "high",
  },
});

HTTPClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig<unknown>) => {
    // edit axios header before sending request, if needed.
    return config;
  },
  (error) => Promise.reject(error),
);

export type BackendError = {
  statusCode: number;
  error: string;
  message: string;
};

// ** Add request/response interceptor
HTTPClient.interceptors.response.use(
  (response: AxiosResponse<unknown, unknown>) => response,
  (error: AxiosError<BackendError>) => {
    return Promise.reject(error);
  },
);

export default HTTPClient;
