export const VERIFICATION_CODE_LENGTH = 6;
export const PASSWORD_MIN_LENGTH = 5;
export const VERIFICATION_CODE_MINUTES_VALIDITY = 5;
export const VERIFICATION_EMAIL_SUBJECT = 'Verification Email _ ECommerce-BND';
export const VERIFICATION_EMAIL_TEXT = (verificationCode: string) =>
  `Please use this code (${verificationCode}) in verification process`;
