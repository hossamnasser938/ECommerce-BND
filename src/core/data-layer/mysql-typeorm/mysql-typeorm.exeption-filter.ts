import { ArgumentsHost, BadRequestException, Catch } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

const ENTITY_NOT_FOUND_ERROR_MESSAGE_MATCHER =
  'Could not find any entity of type';

@Catch()
export class MySQLTypeORMExceptionFilter extends BaseExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    if (
      typeof exception.message === 'string' &&
      exception.message.startsWith(ENTITY_NOT_FOUND_ERROR_MESSAGE_MATCHER)
    ) {
      super.catch(new BadRequestException(exception.message), host);
    } else {
      super.catch(exception, host);
    }
  }
}
