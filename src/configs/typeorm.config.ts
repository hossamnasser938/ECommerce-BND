import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';

import { ConfigWrapperModule } from '../config-wrapper/config-wrapper.module';
import { ConfigWrapperService } from '../config-wrapper/config-wrapper.service';
import { AreaEntity } from '../core/data-layer/mysql-typeorm/entities/area.entity';
import { CartItemEntity } from '../core/data-layer/mysql-typeorm/entities/cart-item.entity';
import { CategoryEntity } from '../core/data-layer/mysql-typeorm/entities/category.entity';
import { CityEntity } from '../core/data-layer/mysql-typeorm/entities/city.entity';
import { FavoriteItemEntity } from '../core/data-layer/mysql-typeorm/entities/favorite-item.entity';
import { FileEntity } from '../core/data-layer/mysql-typeorm/entities/file.entity';
import { NotificationEntity } from '../core/data-layer/mysql-typeorm/entities/notification.entity';
import { NotificationTokenEntity } from '../core/data-layer/mysql-typeorm/entities/notification-token.entity';
import { OrderEntity } from '../core/data-layer/mysql-typeorm/entities/order.entity';
import { PreferenceEntity } from '../core/data-layer/mysql-typeorm/entities/preference.entity';
import { ProductEntity } from '../core/data-layer/mysql-typeorm/entities/product.entity';
import { ProfileEntity } from '../core/data-layer/mysql-typeorm/entities/profile.entity';
import { ShippingAddressEntity } from '../core/data-layer/mysql-typeorm/entities/shipping-address.entity';
import { UserEntity } from '../core/data-layer/mysql-typeorm/entities/user.entity';
import { VerificationCodeEntity } from '../core/data-layer/mysql-typeorm/entities/verification-code.entity';
import { VisualResourceEntity } from '../core/data-layer/mysql-typeorm/entities/visual-resource.entity';
import { DB_TYPE } from '../core/data-layer/mysql-typeorm/types';

const entities = [
  VisualResourceEntity,
  CategoryEntity,
  ProductEntity,
  UserEntity,
  ProfileEntity,
  VerificationCodeEntity,
  CartItemEntity,
  FavoriteItemEntity,
  ShippingAddressEntity,
  CityEntity,
  AreaEntity,
  OrderEntity,
  FileEntity,
  NotificationTokenEntity,
  NotificationEntity,
  PreferenceEntity,
];

const MIGRATIONS_FILES = 'dist/migrations/*{.ts,.js}';

export const typeOrmDataSourceOptions: DataSourceOptions = {
  type: process.env.DB_TYPE as DB_TYPE,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  migrationsTableName: process.env.DB_MIGRATIONS_TABLE_NAME,
  migrations: [MIGRATIONS_FILES],
  synchronize: false,
  entities,
};

export const typeOrmModuleAsyncOptions: TypeOrmModuleAsyncOptions = {
  imports: [ConfigWrapperModule],
  inject: [ConfigWrapperService],
  useFactory: (configWrapperService: ConfigWrapperService) => ({
    type: configWrapperService.DB_TYPE,
    host: configWrapperService.DB_HOST,
    port: configWrapperService.DB_PORT,
    username: configWrapperService.DB_USERNAME,
    password: configWrapperService.DB_PASSWORD,
    database: configWrapperService.DB_NAME,
    migrationsTableName: configWrapperService.DB_MIGRATIONS_TABLE_NAME,
    migrations: [MIGRATIONS_FILES],
    synchronize: false,
    entities,
  }),
};
