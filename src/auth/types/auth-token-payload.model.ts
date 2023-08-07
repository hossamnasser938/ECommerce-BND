import { Identifier } from 'src/core/abstract-data-layer/types';

export interface IAuthTokenPayload {
  sub: Identifier;
  email: string;
}
