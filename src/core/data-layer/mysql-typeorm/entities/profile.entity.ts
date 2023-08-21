import { IProfile } from 'src/core/entities/profile-entity.abstract';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { BaseEntity } from '../base-entity.abstract';
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

  @OneToOne(() => VisualResourceEntity, { cascade: true, eager: true })
  @JoinColumn()
  visualResource: VisualResourceEntity;
}
