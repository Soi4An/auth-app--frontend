export type SignUpParams = {
  email: string,
  name: string,
  password: string,
};

export type SignUpErrors = {
  email: string | null,
  name: string | null,
  password: string | null,
};
