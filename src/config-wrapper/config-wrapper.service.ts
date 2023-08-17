import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

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

  DB_HOST: string = this.configService.get<string>('DB_HOST');
  DB_PORT: number = this.configService.get<number>('DB_PORT');
  DB_USERNAME: string = this.configService.get<string>('DB_USERNAME');
  DB_PASSWORD: string = this.configService.get<string>('DB_PASSWORD');
  DB_NAME: string = this.configService.get<string>('DB_NAME');

  HTTP_PROTOCOL: string = this.configService.get<string>('HTTP_PROTOCOL');
  HOST: string = this.configService.get<string>('HOST');
  PORT: number = this.configService.get<number>('PORT');
}
