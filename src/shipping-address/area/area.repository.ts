import { InjectRepository } from '@nestjs/typeorm';
import { AreaEntity } from 'src/core/data-layer/mysql-typeorm/entities/area.entity';
import { MySQLTypeORMDataLayerRepository } from 'src/core/data-layer/mysql-typeorm/mysql-typeorm.repository';
import { Repository } from 'typeorm';

import { IAreaRepository } from './area.repository.abstract';

export class AreaRepository
  extends MySQLTypeORMDataLayerRepository<AreaEntity>
  implements IAreaRepository<AreaEntity>
{
  constructor(
    @InjectRepository(AreaEntity)
    private readonly areaEntityRepository: Repository<AreaEntity>,
  ) {
    super(areaEntityRepository);
  }

  getOneById(id: number): Promise<AreaEntity> {
    return this.areaEntityRepository.findOneOrFail({
      where: { id },
      relations: { city: true },
    });
  }
}
