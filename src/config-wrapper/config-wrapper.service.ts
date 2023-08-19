import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DB_TYPE } from 'src/core/data-layer/mysql-typeorm/types';

@Injectable()
export class ConfigWrapperService {
  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {}

  NODEMAILER_USER: string = this.configService.get<string>('NODEMAILER_USER');
  NODEMAILER_PASSWORD: string = this.configService.get<string>(
    'NODEMAILER_PASSWORD',
  );

  JWT_SECRET: string = this.configService.get<string>('JWT_SECRET');

  DB_TYPE: DB_TYPE = this.configService.get<string>('DB_TYPE') as DB_TYPE;
  DB_HOST: string = this.configService.get<string>('DB_HOST');
  DB_PORT: number = this.configService.get<number>('DB_PORT');
  DB_USERNAME: string = this.configService.get<string>('DB_USERNAME');
  DB_PASSWORD: string = this.configService.get<string>('DB_PASSWORD');
  DB_NAME: string = this.configService.get<string>('DB_NAME');
  DB_MIGRATIONS_TABLE_NAME: string = this.configService.get<string>(
    'DB_MIGRATIONS_TABLE_NAME',
  );

  HTTP_PROTOCOL: string = this.configService.get<string>('HTTP_PROTOCOL');
  HOST: string = this.configService.get<string>('HOST');
  PORT: number = this.configService.get<number>('PORT');

  GCS_MOUNTED_FOLDER_NAME: string = this.configService.get<string>(
    'GCS_MOUNTED_FOLDER_NAME',
  );
}
