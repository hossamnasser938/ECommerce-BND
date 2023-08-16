import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from 'src/core/data-layer/mysql-typeorm/entities/file.entity';
import { FileStorageModule } from 'src/file-storage/file-storage-module';

import { FileRepository } from './file.repository';
import { FileService } from './file.service';

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity]), FileStorageModule],
  providers: [
    { provide: 'IFileRepository', useClass: FileRepository },
    FileService,
  ],
  exports: ['IFileRepository', FileService],
})
export class FileModule {}
