export type ChangePasswordError = {
  password: string | null;
  confirmation: string | null;
}

export type ChangePasswordParams = {
  password: string;
  confirmation: string;
}
