import axios from 'axios';
import { GATEWAY_URL } from './config';

let accessToken: string | null = null;
let refreshHandler: (() => Promise<string | null>) | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const setRefreshHandler = (handler: () => Promise<string | null>) => {
  refreshHandler = handler;
};

export const gatewayClient = axios.create({
  baseURL: GATEWAY_URL,
});

gatewayClient.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

gatewayClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      refreshHandler &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const newToken = await refreshHandler();
      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return gatewayClient(originalRequest);
      }
    }

    return Promise.reject(error);
  },
);
