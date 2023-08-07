import { generate } from 'otp-generator';

import { VERIFICATION_CODE_LENGTH } from './config-constants';

export const generateVerificationCode = () => {
  return generate(VERIFICATION_CODE_LENGTH, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
};
