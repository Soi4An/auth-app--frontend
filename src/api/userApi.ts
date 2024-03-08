import { ACTIVATION_EMAIL_WAY } from '../config';
import { userClient } from './axios';

type ChangePasswordData = {
  oldPassword: string,
  newPassword: string,
  confirmation: string,
};

type ActivationEmailData = {
  activetionToken: string,
  newEmail: string,
};

export const changeName = (data: { name: string }) => {
  return userClient.patch('/change-name', data);
};

export const changePassword = (data: ChangePasswordData) => {
  return userClient.patch('/change-password', data);
};

export const confirmPassword = (data: { password: string }) => {
  return userClient.post('/confirm-password', data);
};

export const changeEmailRequest = (data: { newEmail: string }) => {
  return userClient.post('/change-email-request', data);
};

export const activationEmail = (data: ActivationEmailData) => {
  return userClient.patch(`/${ACTIVATION_EMAIL_WAY}`, data);
};
