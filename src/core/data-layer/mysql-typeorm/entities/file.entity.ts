import { IFile } from 'src/core/entities/file.entity.abstract';
import { AfterLoad, Column, Entity, ManyToOne } from 'typeorm';

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

  url: string;

  @ManyToOne(
    () => VisualResourceEntity,
    (visualResource) => visualResource.images,
  )
  visualResource: VisualResourceEntity;

  @AfterLoad()
  setPath() {
    // TODO: discuss with Affan
    // implementation delegated to storage service
  }
}
