import { ICustomMulterFileProperties } from 'src/file-storage/file-storage.types';

export type ExtendedMulterFile = Express.Multer.File &
  ICustomMulterFileProperties;
