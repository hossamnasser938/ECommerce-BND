import { Exclude } from 'class-transformer';
import { IFile } from 'src/core/entities/file.entity.abstract';
import { AfterLoad, Column, Entity, ManyToOne } from 'typeorm';

import { BaseEntity } from '../base-entity.abstract';
import { VisualResourceEntity } from './visual-resource.entity';

@Entity({ name: 'file' })
export class FileEntity extends BaseEntity implements IFile {
  constructor(storageIdentifier: string, visualResource: VisualResourceEntity) {
    super();
    this.storageIdentifier = storageIdentifier;
    this.visualResource = visualResource;
  }

  @Column()
  @Exclude()
  storageIdentifier: string;

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
