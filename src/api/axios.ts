import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { accessTokenService } from '../utils/accessTokenService';
import { refresh } from './authApi';

export function createClient(extraUrl?: string) {
  const serverUrl = process.env.SERVER_DOMAIN || 'http://localhost:3005';
  const result = extraUrl ? serverUrl + extraUrl : serverUrl;

  return axios.create({
    baseURL: result,
    withCredentials: true,
  });
}

export const authClient = createClient();
// authClient.interceptors.response.use(res => res.data);

export const userClient = createClient('/user');

userClient.interceptors.request.use(onRequest);
userClient.interceptors.response.use(null, onResponseError);
// httpClient.interceptors.response.use(res => res.data, onResponseError);

function onRequest(request: InternalAxiosRequestConfig) {
  const accessToken = accessTokenService.get();

  if (accessToken) {
    request.headers['Authorization'] = `Bearer ${accessToken}`;
  }

  return request;
}

async function onResponseError(error: AxiosError) {
  const originalRequest = error.config;

  if (error.response && error.response.status !== 401) {
    throw error;
  }

  if (originalRequest) {
    const res = await refresh().catch((err) => {
      console.log(err);
      throw err;
    });

    accessTokenService.save(res.data.accessToken);

    return userClient.request(originalRequest);
  }

  throw error;
}
