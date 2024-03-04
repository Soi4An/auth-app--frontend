
function email(email: string): string | null {
  if (!email) {
    return 'Email is required';
  }

  const emailPattern = /^[\w.+-]+@([\w-]+\.){1,3}[\w-]{2,}$/;

  if (!emailPattern.test(email)) {
    return 'Invalid email (example@example.com)';
  }

  return null;
}

function name(name: string): string | null {
  if (!name) {
    return 'Name is required';
  }

  const namePattern = /^[a-zA-Z ]{2,20}$/;

  if (!namePattern.test(name)) {
    return 'Invalid name (letters, length 2-20)';
  }

  return null;
}

function password(password: string): string | null {
  if (!password) {
    return 'Password is required';
  }

  if (password.length < 6) {
    return 'At least 6 characters';
  }

  return null;
}

export const validationErrors = {
  email,
  name,
  password,
};
