import { Inject, Injectable } from '@nestjs/common';
import { Identifier } from 'src/core/abstract-data-layer/types';
import { IFile } from 'src/core/entities/file.entity.abstract';
import { IVisualResource } from 'src/core/entities/visual-resource.entity.abstract';
import { AbstractFileStorageService } from 'src/file-storage/file-storage.service.abstract';

import { IFileRepository } from './file.repository.abstract';

@Injectable()
export class FileService {
  constructor(
    @Inject('IFileRepository')
    private readonly fileRepository: IFileRepository<IFile>,
    @Inject('FileStorageService')
    private readonly fileStroageService: AbstractFileStorageService,
  ) {}

  createOne<T extends { visualResource: IVisualResource }>(
    fileStorageIdentifier: string,
    entity: T,
  ) {
    return this.fileRepository.createOne(
      fileStorageIdentifier,
      entity.visualResource,
    );
  }

  createMany<T extends { visualResource: IVisualResource }>(
    fileStorageIdentifiers: string[],
    entity: T,
  ) {
    return fileStorageIdentifiers.map((fileStorageIdentifier) =>
      this.createOne(fileStorageIdentifier, entity),
    );
  }

  async deleteOne(id: Identifier) {
    const file = await this.fileRepository.getOneById(id);
    this.fileStroageService.deleteFile(file.storageIdentifier);
    const deleted = await this.fileRepository.deleteOneById(id);
    return deleted;
  }
}
