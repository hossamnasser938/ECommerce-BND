import { BaseEntity } from './base-entity.abstract';
import { IFile } from './file.entity.abstract';

export interface IVisualResource extends BaseEntity {
  images: IFile[];
}
