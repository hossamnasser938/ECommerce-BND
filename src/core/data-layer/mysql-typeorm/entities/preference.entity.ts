import { IPreference } from 'src/core/entities/preference.entity.abstract';
import { Column, Entity, OneToOne } from 'typeorm';

import { BaseEntity } from '../base-entity.abstract';
import { UserEntity } from './user.entity';

@Entity({ name: 'preference' })
export class PreferenceEntity extends BaseEntity implements IPreference {
  constructor() {
    super();
    this.getNotifications = true;
  }

  @OneToOne(() => UserEntity)
  user: UserEntity;

  @Column()
  getNotifications: boolean;
}
