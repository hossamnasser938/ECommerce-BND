import { Role } from 'src/auth/auth.enums';

export interface IUser {
  email: string;
  password: string;
  name: string;
  roles: Role[];
  verified: boolean;
}
