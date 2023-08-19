import { InjectRepository } from '@nestjs/typeorm';
import { CityEntity } from 'src/core/data-layer/mysql-typeorm/entities/city.entity';
import { MySQLTypeORMDataLayerRepository } from 'src/core/data-layer/mysql-typeorm/mysql-typeorm.repository';
import { Repository } from 'typeorm';

import { ICityRepository } from './city.repository.abstract';

export class CityRepository
  extends MySQLTypeORMDataLayerRepository<CityEntity>
  implements ICityRepository<CityEntity>
{
  constructor(
    @InjectRepository(CityEntity)
    private readonly cityEntityRepository: Repository<CityEntity>,
  ) {
    super(cityEntityRepository);
  }
}
