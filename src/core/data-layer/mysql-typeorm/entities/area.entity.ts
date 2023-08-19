import { IArea } from 'src/core/entities/area-entity.abstract';
import { Column, Entity, ManyToOne } from 'typeorm';

import { BaseEntity } from '../base-entity.abstract';
import { CityEntity } from './city.entity';

@Entity({ name: 'area' })
export class AreaEntity extends BaseEntity implements IArea {
  @Column()
  name: string;

  @ManyToOne(() => CityEntity, (cityEntity) => cityEntity.areas)
  city: CityEntity;
}
