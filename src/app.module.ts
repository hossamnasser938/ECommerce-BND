import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';
import { CategoryModule } from './category/category.module';
import { ConfigWrapperModule } from './config-wrapper/config-wrapper.module';
import { ConfigWrapperService } from './config-wrapper/config-wrapper.service';
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
import { SearchModule } from './search/search.module';
import { ShippingAddressModule } from './shipping-address/shipping-address.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigWrapperModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigWrapperModule],
      inject: [ConfigWrapperService],
      useFactory: (configWrapperService: ConfigWrapperService) => ({
        type: 'mysql',
        host: configWrapperService.DB_HOST,
        port: configWrapperService.DB_PORT,
        username: configWrapperService.DB_USERNAME,
        password: configWrapperService.DB_PASSWORD,
        database: configWrapperService.DB_NAME,
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
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigWrapperModule],
      inject: [ConfigWrapperService],
      useFactory: (configWrapperService: ConfigWrapperService) => ({
        secret: configWrapperService.JWT_SECRET,
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
    SearchModule,
  ],
  providers: [{ provide: APP_FILTER, useClass: MySQLTypeORMExceptionFilter }],
})
export class AppModule {}
