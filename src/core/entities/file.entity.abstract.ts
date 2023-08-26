import { BaseEntity } from './base-entity.abstract';
import { IVisualResource } from './visual-resource.entity.abstract';

export interface IFile extends BaseEntity {
  storageIdentifier: string;
  url: string;
  visualResource: IVisualResource;
}
