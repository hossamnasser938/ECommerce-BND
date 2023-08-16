import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItemEntity } from 'src/core/data-layer/mysql-typeorm/entities/cart-item.entity';
import { ProductModule } from 'src/product/product.module';

import { CART_REPOSITORY_PROVIDER_TOKEN } from './cart.constants';
import { CartController } from './cart.controller';
import { CartRepository } from './cart.repository';
import { CartService } from './cart.service';

@Module({
  imports: [TypeOrmModule.forFeature([CartItemEntity]), ProductModule],
  providers: [
    CartService,
    { provide: CART_REPOSITORY_PROVIDER_TOKEN, useClass: CartRepository },
  ],
  controllers: [CartController],
  exports: [CartService, CART_REPOSITORY_PROVIDER_TOKEN],
})
export class CartModule {}
