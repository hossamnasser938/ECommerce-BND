import { IVisualResource } from 'src/core/entities/visual-resource.entity.abstract';
import { Entity, OneToMany } from 'typeorm';

import { BaseEntity } from '../base-entity.abstract';
import { FileEntity } from './file.entity';

@Entity({ name: 'visual_resource' })
export class VisualResourceEntity
  extends BaseEntity
  implements IVisualResource
{
  @OneToMany(() => FileEntity, (fileEntity) => fileEntity.visualResource, {
    eager: true,
  })
  images: FileEntity[];
}
