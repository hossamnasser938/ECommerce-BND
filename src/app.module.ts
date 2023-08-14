import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';
import { CategoryModule } from './category/category.module';
import { CartItemEntity } from './core/data-layer/mysql-typeorm/entities/cart-item.entity';
import { CategoryEntity } from './core/data-layer/mysql-typeorm/entities/category.entity';
import { FavoriteItemEntity } from './core/data-layer/mysql-typeorm/entities/favorite-item.entity';
import { FileEntity } from './core/data-layer/mysql-typeorm/entities/file.entity';
import { OrderEntity } from './core/data-layer/mysql-typeorm/entities/order.entity';
import { ProductEntity } from './core/data-layer/mysql-typeorm/entities/product.entity';
import { ShippingAddressEntity } from './core/data-layer/mysql-typeorm/entities/shipping-address.entity';
import { UserEntity } from './core/data-layer/mysql-typeorm/entities/user.entity';
import { VerificationCodeEntity } from './core/data-layer/mysql-typeorm/entities/verification-code.entity';
import { VisualResourceEntity } from './core/data-layer/mysql-typeorm/entities/visual-resource.entity';
import { MySQLTypeORMExceptionFilter } from './core/data-layer/mysql-typeorm/mysql-typeorm.exeption-filter';
import { FavoriteModule } from './favorite/favorite.module';
import { FileModule } from './file/file.module';
import { MulterWrapperModule } from './multer-wrapper/multer-wrapper.module';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';
import { ShippingAddressModule } from './shipping-address/shipping-address.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [
          VisualResourceEntity,
          CategoryEntity,
          ProductEntity,
          UserEntity,
          VerificationCodeEntity,
          CartItemEntity,
          FavoriteItemEntity,
          ShippingAddressEntity,
          OrderEntity,
          FileEntity,
        ],
        synchronize: true,
      }),
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
    }),
    MulterWrapperModule,
    CategoryModule,
    ProductModule,
    UserModule,
    AuthModule,
    CartModule,
    FavoriteModule,
    ShippingAddressModule,
    OrderModule,
    FileModule,
  ],
  providers: [{ provide: APP_FILTER, useClass: MySQLTypeORMExceptionFilter }],
})
export class AppModule {}
