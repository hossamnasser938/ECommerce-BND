import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DataSource } from 'typeorm';

import { AppModule } from './app.module';
import { ConfigWrapperService } from './config-wrapper/config-wrapper.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const reflector = app.get(Reflector);
  const dataSource = app.get(DataSource);
  const configWrapperService = app.get(ConfigWrapperService);

  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  await dataSource.runMigrations();

  await app.listen(configWrapperService.PORT);
}
bootstrap();
