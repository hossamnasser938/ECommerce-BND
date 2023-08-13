import { Injectable } from '@nestjs/common';
import { existsSync, mkdirSync, unlinkSync } from 'fs';
import * as path from 'path';
import { uuid } from 'uuidv4';

import { UPLOADS_DESTINATION } from './fs-wrapper.constants';

@Injectable()
export class FSWrapperService {
  prepareDestination(): string {
    if (!existsSync(UPLOADS_DESTINATION)) {
      mkdirSync(UPLOADS_DESTINATION);
    }

    return UPLOADS_DESTINATION;
  }

  constructFileName(mimeType: string) {
    const [, extension] = mimeType.split('/');
    const uniqueId = uuid();
    const fileName = `${uniqueId}.${extension}`;
    return fileName;
  }

  getFilePath(fileName: string): string {
    return path.join(UPLOADS_DESTINATION, fileName);
  }

  deleteFile(fileName: string) {
    const filePath = this.getFilePath(fileName);
    unlinkSync(filePath);
  }
}
