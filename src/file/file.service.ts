import { Inject, Injectable } from '@nestjs/common';
import { Identifier } from 'src/core/abstract-data-layer/types';
import { IFile } from 'src/core/entities/file.entity.abstract';
import { IVisualResource } from 'src/core/entities/visual-resource.entity.abstract';
import { FSWrapperService } from 'src/fs-wrapper/fs-wrapper.service';

import { IFileRepository } from './file.repository.abstract';

@Injectable()
export class FileService {
  constructor(
    @Inject('IFileRepository')
    private readonly fileRepository: IFileRepository<IFile>,
    @Inject(FSWrapperService)
    private readonly fSWrapperService: FSWrapperService,
  ) {}

  createOne<T extends { visualResource: IVisualResource }>(
    fileName: string,
    entity: T,
  ) {
    return this.fileRepository.createOne(fileName, entity.visualResource);
  }

  async deleteOne(id: Identifier) {
    const file = await this.fileRepository.getOneById(id);
    this.fSWrapperService.deleteFile(file.name);
    const deleted = await this.fileRepository.deleteOneById(id);
    return deleted;
  }
}
