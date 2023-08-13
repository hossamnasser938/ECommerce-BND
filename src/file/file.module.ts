import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from 'src/core/data-layer/mysql-typeorm/entities/file.entity';
import { FSWrapperModule } from 'src/fs-wrapper/fs-wrapper.module';

import { FileRepository } from './file.repository';
import { FileService } from './file.service';

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity]), FSWrapperModule],
  providers: [
    { provide: 'IFileRepository', useClass: FileRepository },
    FileService,
  ],
  exports: ['IFileRepository', FileService],
})
export class FileModule {}
