import { DeleteResult, UpdateResult } from 'typeorm';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ERROR_MESSAGES } from './error-messages';

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

export const handleTypeORMUpdateDeleteResult = ({
  result,
  multipleEntities = false,
  skipCheck = false,
}: {
  result: UpdateResult | DeleteResult;
  multipleEntities?: boolean;
  skipCheck?: boolean;
}) => {
  if (skipCheck) return true;

  if (result.affected === 0)
    throw new NotFoundException(ERROR_MESSAGES.NO_ENTITIES_AFFECTED);

  if (result.affected === 1) return true;

  if (result.affected > 1)
    if (multipleEntities) return true;
    else
      throw new InternalServerErrorException(
        ERROR_MESSAGES.MULTIPLE_ENTITIES_AFFECTED,
      );
};
