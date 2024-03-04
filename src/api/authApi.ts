import { authClient } from "./axios";
import { ActivateAccountResponse, ForgotActivateParams } from "../types/authApi";
import { SignUpParams } from "../types/SignUp";
import { SignInParams } from "../types/SignIn";

export const refresh = () => {
  return authClient.get<ActivateAccountResponse>('/refresh');
};

export const checkRefresh = () => {
  return authClient.get<{ isValid: boolean }>('/check');
};

export const registrRequest = (data: SignUpParams) => {
  return authClient.post('/register', data);
};

export const registrActivate = (way: string, token: string) => {
  return authClient.post<ActivateAccountResponse>(`/${way}/${token}`);
};

export const forgot = (data: { email: string }) => {
  return authClient.post(`/forgot`, data);
};

export const forgotActivate = (data: ForgotActivateParams) => {
  const { way, token, password, confirmation } = data;
  const newData = { password, confirmation };

  return authClient.post(`/${way}/${token}`, newData);
};

export const login = (data: SignInParams) => {
  return authClient.post<ActivateAccountResponse>('/login', data);
};

export const logout = () => {
  return authClient.post(`/logout`);
};
