import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { AUTH_CONSTANTS } from './auth/auth.constants';
import { CartModule } from './cart/cart.module';
import { FavoriteModule } from './favorite/favorite.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'rootpass',
      database: 'ecommerce',
      autoLoadEntities: true,
      synchronize: true,
    }),
    JwtModule.register({
      global: true,
      secret: AUTH_CONSTANTS.JWT_SECRET,
    }),
    CategoryModule,
    ProductModule,
    UserModule,
    AuthModule,
    CartModule,
    FavoriteModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
