import { DeleteResult, UpdateResult } from 'typeorm';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

export const successfulUpdateDeleteResponse = (message = '') => {
  return {
    success: true,
    message,
  };
};

export const failureUpdateDeleteResponse = (reason = 'Unknown') => {
  return {
    success: false,
    reason,
  };
};

export const updateDeleteResponse = (success: boolean) => {
  return success
    ? successfulUpdateDeleteResponse()
    : failureUpdateDeleteResponse();
};

export const checkTypeORMUpdateDeleteResult = (
  result: UpdateResult | DeleteResult,
  multipleEntities = false,
) => {
  if (result.affected === 0) throw new NotFoundException();
  if (result.affected === 1) return true;
  if (result.affected > 1)
    if (multipleEntities) return true;
    else
      throw new InternalServerErrorException(
        `Dangerous - ${
          result instanceof UpdateResult ? 'Updated' : 'Deleted'
        } multiple entities`,
      );
};
