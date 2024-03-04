export const ACTIVATION_ACCOUNT_WAY = 'account-activation';
export const ACTIVATION_PASSWORD_WAY = 'password-activation';
export const ACTIVATION_EMAIL_WAY = 'email-activation';

export const AlertMessageError = "Something went wrong...";
export const AlertMessageSuccess = "Data received! Follow the link in your email to complete your activation.";

export const ChangeParamsError = "Something went wrong. You can go back to your profile and try again later.";
export const ChangeParamsSuccess = (param: string) => {
  const correct = param.slice(0, 1).toLocaleUpperCase() + param.slice(1);
  
  return `${correct} was changed successfully. You can go back to your profile.`;
}
