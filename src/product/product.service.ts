import { Inject, Injectable } from '@nestjs/common';
import { PaginationParamsDTO } from 'src/core/abstract-data-layer/dtos';
import { Identifier } from 'src/core/abstract-data-layer/types';
import { IProduct } from 'src/core/entities/product.entity.abstract';
import { FileService } from 'src/file/file.service';
import { AbstractFileStorageService } from 'src/file-storage/file-storage.service.abstract';
import { FILE_STOREAGE_SERVICE_PROVIDER_TOKEN } from 'src/file-storage/fs-file-storeage.constants';

import { CreateProductDTO } from './dtos/create-product.dto';
import { UpdateProductDTO } from './dtos/update-product.dto';
import { PRODUCT_REPOSITORY_PROVIDER_TOKEN } from './product.constants';
import { IProductRepository } from './product.repository.abstract';

@Injectable()
export class ProductService {
  constructor(
    @Inject(PRODUCT_REPOSITORY_PROVIDER_TOKEN)
    private readonly productRepository: IProductRepository<IProduct>,
    @Inject(FileService) private readonly fileService: FileService,
    @Inject(FILE_STOREAGE_SERVICE_PROVIDER_TOKEN)
    private readonly fileStorageService: AbstractFileStorageService,
  ) {}

  async findOneById(id: Identifier) {
    const product = await this.productRepository.getOneById(id);
    return product;
  }

  findAll(paginationParametersDTO: PaginationParamsDTO) {
    return this.productRepository.getAll(paginationParametersDTO);
  }

  findCategoryProducts(
    categoryId: Identifier,
    paginationParametersDTO: PaginationParamsDTO,
  ) {
    return this.productRepository.getCategoryProducts(
      categoryId,
      paginationParametersDTO,
    );
  }

  async createOne(createProductDTO: CreateProductDTO) {
    return this.productRepository.createOne(createProductDTO);
  }

  async updateOneById(id: Identifier, updateProductDTO: UpdateProductDTO) {
    const updated = await this.productRepository.updateOneById(
      id,
      updateProductDTO,
    );
    return updated;
  }

  async deleteOneById(id: Identifier) {
    const deleted = await this.productRepository.deleteOneById(id);
    return deleted;
  }

  async addImages(productId: Identifier, imagesStorageIdentifiers: string[]) {
    try {
      const product = await this.findOneById(productId);
      await this.fileService.createMany(imagesStorageIdentifiers, product);
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
