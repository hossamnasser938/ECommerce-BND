import { IUser } from './user.entity.abstract';
import { IVisualResource } from './visual-resource.entity.abstract';

export interface IProfile {
  user: IUser;
  name: string;
  visualResource: IVisualResource;
}
