import { IFile } from 'src/core/entities/file.entity.abstract';
import { Column, Entity, ManyToOne } from 'typeorm';

import { BaseEntity } from '../base-entity.abstract';
import { VisualResourceEntity } from './visual-resource.entity';

@Entity({ name: 'file' })
export class FileEntity extends BaseEntity implements IFile {
  constructor(name: string, visualResource: VisualResourceEntity) {
    super();
    this.name = name;
    this.visualResource = visualResource;
  }

  @Column()
  name: string;

  @ManyToOne(
    () => VisualResourceEntity,
    (visualResource) => visualResource.images,
  )
  visualResource: VisualResourceEntity;
}
