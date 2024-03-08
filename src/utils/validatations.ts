import { ChangePasswordParams } from '../types/ChangePassword';
import { validationErrors } from './validationErrors';

export function validateChangePasswordParams(params: ChangePasswordParams) {
  const { password, confirmation } = params;

  const errPassword = validationErrors.password(password);
  const errConfirmation: string | null =
  password !== confirmation ? 'Passwords are not equivalent' : null;

  if (!errPassword && !errConfirmation) {
    return null;
  }

  return {
    password: errPassword,
    confirmation: errConfirmation,
  };
}
