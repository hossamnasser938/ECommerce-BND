import { BaseEntity } from './base-entity.abstract';
import { IFile } from './file.entity.abstract';
import { IUser } from './user.entity.abstract';
import { IVisualResource } from './visual-resource.entity.abstract';

export interface IProfile extends BaseEntity {
  user: IUser;
  name: string;
  visualResource: IVisualResource;
  photo?: IFile;
}
