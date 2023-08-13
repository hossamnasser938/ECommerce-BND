import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from 'src/core/data-layer/mysql-typeorm/entities/file.entity';
import { VisualResourceEntity } from 'src/core/data-layer/mysql-typeorm/entities/visual-resource.entity';
import { MySQLTypeORMDataLayerRepository } from 'src/core/data-layer/mysql-typeorm/mysql-typeorm.repository';
import { Repository } from 'typeorm';

import { IFileRepository } from './file.repository.abstract';

export class FileRepository
  extends MySQLTypeORMDataLayerRepository<FileEntity>
  implements IFileRepository<FileEntity>
{
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileEntityRepository: Repository<FileEntity>,
  ) {
    super(fileEntityRepository);
  }

  createOne(
    fileName: string,
    visualResource: VisualResourceEntity,
  ): Promise<FileEntity> {
    const file = new FileEntity(fileName, visualResource);
    return this.fileEntityRepository.save(file);
  }
}
