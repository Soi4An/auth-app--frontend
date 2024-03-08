import { User } from '../types/User';
import { authClient } from './axios';

export const googleGetUser = () => {
  return authClient.get<{ user: User }>('/auth/google/success');
};

export const googleLogout = () => {
  return authClient.post('/auth/google/logout', {}, { withCredentials: false });
};
