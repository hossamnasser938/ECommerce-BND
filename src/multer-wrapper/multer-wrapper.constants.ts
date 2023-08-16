import { FileTypeValidator, MaxFileSizeValidator } from '@nestjs/common';

const MAX_IMAGE_SIZE = 10000000; // 10 MB
const IMAGES_MIME_TYPE_RE = /(^image)(\/)[a-zA-Z0-9_]*/;

export const MAX_IMAGES_PER_ONE_UPLOAD = 10;

export const IMAGES_VALIDATORS = [
  new MaxFileSizeValidator({ maxSize: MAX_IMAGE_SIZE }),
  new FileTypeValidator({ fileType: IMAGES_MIME_TYPE_RE }),
];
