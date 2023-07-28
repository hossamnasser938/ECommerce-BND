import { Length, MinLength } from 'class-validator';
import {
  PASSWORD_MIN_LENGTH,
  VERIFICATION_CODE_LENGTH,
} from './config-constants';

export const IsPassword = () => MinLength(PASSWORD_MIN_LENGTH);

export const IsVerificationCode = () => Length(VERIFICATION_CODE_LENGTH);
