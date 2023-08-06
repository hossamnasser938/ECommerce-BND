import { BaseEntity } from './base-entity.abstract';

export interface IUser extends BaseEntity {
  email: string;
  password: string;
  name: string;
  roles: string;
  verified: boolean;
}
