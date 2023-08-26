import { Exclude } from 'class-transformer';
import { IProfile } from 'src/core/entities/profile-entity.abstract';
import { AfterLoad, Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { BaseEntity } from '../base-entity.abstract';
import { FileEntity } from './file.entity';
import { UserEntity } from './user.entity';
import { VisualResourceEntity } from './visual-resource.entity';

@Entity({ name: 'profile' })
export class ProfileEntity extends BaseEntity implements IProfile {
  constructor() {
    super();
    this.visualResource = new VisualResourceEntity();
    this.name = '';
  }

  @OneToOne(() => UserEntity)
  user: UserEntity;

  @Column()
  name: string;

  @Exclude()
  @OneToOne(() => VisualResourceEntity, { cascade: true, eager: true })
  @JoinColumn()
  visualResource: VisualResourceEntity;

  photo?: FileEntity;

  @AfterLoad()
  hideVisualResource() {
    const photo = this.visualResource.images.length
      ? this.visualResource.images[0]
      : null;
    this.photo = photo;
  }
}
