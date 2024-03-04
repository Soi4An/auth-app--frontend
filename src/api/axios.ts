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
    try {
      const res = await refresh();
  
      accessTokenService.save(res.data.accessToken);
  
      return userClient.request(originalRequest);
    } catch (error) {
      throw error;
    }
  }

  throw error;
}

// ----------------------------------------------------------

// async function makeRequest<T>(
//   url: string,
//   method: string,
//   data: any = null,
//   params: any = null
// ): Promise<T> {
//   const requestUrl = process.env.SERVER_DOMAIN + url;
//   const accessToken = localStorage.getItem('accessToken');

//   if (accessToken) {
//     axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
//   }
//   // InternalAxiosRequestConfig
//   const config: AxiosRequestConfig = {
//     method,
//     url: params ? requestUrl : `${requestUrl}?${new URLSearchParams(params)}`,
//     data,
//   };

//   try {
//     const response: AxiosResponse<T> = await axios(config);
//     return response.data;
//   } catch (error) {
//     if ((error as AxiosError)?.response?.status === 401) {
//       // Обробити статус-код 401 тут, наприклад, спробувати оновити токен
//       console.log('Статус-код 401. Спробуйте оновити токен або взяти інші заходи');
//     }
//     throw error;
//   }
// }

// export const client = {
//   get: <T>(url: string, params: any = null): Promise<T> => makeRequest(url, 'GET', null, params),
//   post: <T>(url: string, data: any = null): Promise<T> => makeRequest(url, 'POST', data),
//   patch: <T>(url: string, data: any = null): Promise<T> => makeRequest(url, 'PATCH', data),
// };
