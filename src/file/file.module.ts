import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from 'src/core/data-layer/mysql-typeorm/entities/file.entity';
import { FileStorageModule } from 'src/file-storage/file-storage-module';

import { FILE_REPOSITORY_PROVIDER_TOKEN } from './file.constants';
import { FileRepository } from './file.repository';
import { FileService } from './file.service';

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity]), FileStorageModule],
  providers: [
    { provide: FILE_REPOSITORY_PROVIDER_TOKEN, useClass: FileRepository },
    FileService,
  ],
  exports: [FILE_REPOSITORY_PROVIDER_TOKEN, FileService],
})
export class FileModule {}
