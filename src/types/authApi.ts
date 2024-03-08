import { User } from './User';

export type ActivateAccountResponse = {
  user: User,
  accessToken: string,
};

export type ForgotActivateParams = {
  way: string,
  token: string,
  password: string,
  confirmation: string,
}
