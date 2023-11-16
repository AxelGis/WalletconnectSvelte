import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { _ } from 'svelte-i18n';
import { get } from 'svelte/store';

import { AlertType, addAlert } from '../stores/alerts';

export type ApiErrorResponse = {
  errorCode?: number;
  errorMessage?: string;
};

export type ApiErrorInternal = Pick<Error, 'message'> &
  Pick<AxiosError, 'response' | 'config'> &
  ApiErrorResponse;

export type ApiError = ApiErrorResponse & {
  handled: boolean;
};

export type ApiResponse = ApiErrorResponse & {
  result?: any;
};

const baseURL: string = import.meta.env.VITE_API_URL;

const axiosApi: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

const apiRequest = async <T>(
  method: string,
  url: string,
  request?: Record<string, any>
) => {
  axiosApi.interceptors.request.use((config): InternalAxiosRequestConfig => {
    config.headers['request-startTime'] = Date.now();
    return config;
  });

  axiosApi.interceptors.response.use((response): AxiosResponse => {
    const start: number = response.config.headers['request-startTime'];
    const end: number = Date.now();
    response.headers['request-duration'] = end - start;
    return response;
  });

  return axiosApi({
    method,
    url,
    data: request,
  })
    .then((res: AxiosResponse) => {
      const data: ApiResponse = res.data;
      if (data.errorCode === 0) {
        return Promise.resolve<T>(data.result);
      }
      return Promise.reject({ ...data, config: res.config });
    })
    .catch((err: ApiErrorInternal) => {
      const config: InternalAxiosRequestConfig = err.config || err.response?.config;
      const duration: number = config
        ? Date.now() - config.headers['request-startTime']
        : 0;

      // we can add custom error handler:
      // Api.get(...).catch(err => err.handled = true)
      // and skip call errorHandler
      const error: ApiError = {
        errorCode: err.errorCode || -1,
        errorMessage: getErrorMessage(err),
        handled: false,
      };

      // this timeout starts after custom block .catch() executed
      // because microtasks (promise) have priority on macrotasks (timeout)
      setTimeout(() => {
        if (!error.handled) {
          errorHandler(url, method.toUpperCase(), error, duration);
        }
      });

      throw error;
    });
};

const getErrorMessage = (err: ApiErrorInternal) => {
  if (err.errorMessage) {
    return err.errorMessage;
  } else if (err.response?.status) {
    return `${err.response?.status} ${err.response?.statusText}`;
  } else if (err.message) {
    return err.message;
  } else {
    return get(_)('alerts.error.unknownError');
  }
};

const getRequest = <T>(url: string, request?: Record<string, string>) =>
  apiRequest<T>(
    'get',
    request ? `${url}?${new URLSearchParams(request).toString()}` : url
  );

const deleteRequest = <T>(url: string, request: Record<string, any>) =>
  apiRequest<T>('delete', url, request);

const post = <T>(url: string, request: Record<string, any>) =>
  apiRequest<T>('post', url, request);

const put = <T>(url: string, request: Record<string, any>) =>
  apiRequest<T>('put', url, request);

const patch = <T>(url: string, request: Record<string, any>) =>
  apiRequest<T>('patch', url, request);

const errorHandler = (
  url: string,
  method: string,
  response: ApiErrorResponse,
  duration: number = 0
) => {
  addAlert({
    message: response.errorMessage,
    type: AlertType.ERROR,
    info: { url: `${baseURL}${url}`, method, response, duration },
  });
};

export const Api = {
  get: getRequest,
  delete: deleteRequest,
  post,
  put,
  patch,
};
