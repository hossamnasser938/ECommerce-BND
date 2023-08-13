import { GenericRepository } from 'src/core/abstract-data-layer/generic-repository.abstract';
import { IFile } from 'src/core/entities/file.entity.abstract';
import { IVisualResource } from 'src/core/entities/visual-resource.entity.abstract';

export interface IFileRepository<T extends IFile> extends GenericRepository<T> {
  createOne(fileName: string, visualResource: IVisualResource): Promise<T>;
}
