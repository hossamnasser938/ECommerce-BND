import { ICity } from 'src/core/entities/city-entity.abstract';
import { Column, Entity, OneToMany } from 'typeorm';

import { BaseEntity } from '../base-entity.abstract';
import { AreaEntity } from './area.entity';

@Entity({ name: 'city' })
export class CityEntity extends BaseEntity implements ICity {
  @Column()
  name: string;

  @OneToMany(() => AreaEntity, (areaEntity) => areaEntity.city, { eager: true })
  areas: AreaEntity[];
}
