import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';
import { CategoryModule } from './category/category.module';
import { ConfigWrapperModule } from './config-wrapper/config-wrapper.module';
import { jwtModuleAsyncOptions } from './configs/jwt.config';
import { typeOrmModuleAsyncOptions } from './configs/typeorm.config';
import { MySQLTypeORMExceptionFilter } from './core/data-layer/mysql-typeorm/mysql-typeorm.exeption-filter';
import { FavoriteModule } from './favorite/favorite.module';
import { FileModule } from './file/file.module';
import { MulterWrapperModule } from './multer-wrapper/multer-wrapper.module';
import { NotificationModule } from './notification/notification.module';
import { OrderModule } from './order/order.module';
import { PreferenceModule } from './preference/preference.module';
import { ProductModule } from './product/product.module';
import { SearchModule } from './search/search.module';
import { ShippingAddressModule } from './shipping-address/shipping-address.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigWrapperModule,
    TypeOrmModule.forRootAsync(typeOrmModuleAsyncOptions),
    JwtModule.registerAsync(jwtModuleAsyncOptions),
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
    NotificationModule,
    PreferenceModule,
  ],
  providers: [{ provide: APP_FILTER, useClass: MySQLTypeORMExceptionFilter }],
})
export class AppModule {}
