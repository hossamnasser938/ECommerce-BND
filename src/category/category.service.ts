import { Inject, Injectable } from '@nestjs/common';
import { PaginationParamsDTO } from 'src/core/abstract-data-layer/dtos';
import { Identifier } from 'src/core/abstract-data-layer/types';
import { ICategory } from 'src/core/entities/category.entity.abstract';
import { FileService } from 'src/file/file.service';
import { AbstractFileStorageService } from 'src/file-storage/file-storage.service.abstract';

import { ICategoryRepository } from './category.repository.abstract';
import { CreateCategoryDTO } from './dtos/create-category.dto';
import { UpdateCategoryDTO } from './dtos/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @Inject('ICategoryRepository')
    private readonly categroyRepositoy: ICategoryRepository<ICategory>,
    @Inject(FileService) private readonly fileService: FileService,
    @Inject('FileStorageService')
    private readonly fileStorageService: AbstractFileStorageService,
  ) {}

  async findAll(paginationParametersDTO: PaginationParamsDTO) {
    return this.categroyRepositoy.getAll(paginationParametersDTO);
  }

  async findOneById(id: Identifier) {
    const category = await this.categroyRepositoy.getOneById(id);
    return category;
  }

  async createOne(createCategoryDTO: CreateCategoryDTO) {
    return this.categroyRepositoy.createOne(createCategoryDTO);
  }

  async updateOneById(
    id: Identifier,
    updateCategoryDTO: UpdateCategoryDTO,
  ): Promise<boolean> {
    const updated = await this.categroyRepositoy.updateOneById(
      id,
      updateCategoryDTO,
    );
    return updated;
  }

  async deleteOneById(id: Identifier) {
    const deleted = await this.categroyRepositoy.deleteOneById(id);
    return deleted;
  }

  async addImages(categoryId: Identifier, imagesStorageIdentifiers: string[]) {
    try {
      const category = await this.findOneById(categoryId);
      await this.fileService.createMany(imagesStorageIdentifiers, category);
      return true;
    } catch (err) {
      imagesStorageIdentifiers.forEach((imagesStorageIdentifier) => {
        this.fileStorageService.deleteFile(imagesStorageIdentifier);
      });
      throw err;
    }
  }

  async deleteImage(imageId: Identifier) {
    const deleted = await this.fileService.deleteOne(imageId);
    return deleted;
  }
}
