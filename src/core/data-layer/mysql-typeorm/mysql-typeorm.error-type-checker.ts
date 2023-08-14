import { QueryFailedError } from 'typeorm';

export const MYSQL_TYPEORM_ERROR_TYPE_CHECKER = {
  DUPLICATE_ENTRY: (err: any) => {
    return (
      err instanceof QueryFailedError && err.driverError.code === 'ER_DUP_ENTRY'
    );
  },
};
