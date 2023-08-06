import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { ProductModule } from 'src/product/product.module';
import { CartItemEntity } from 'src/core/data-layer/mysql-typeorm/entities/cart-item.entity';
import { CartRepository } from './cart.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CartItemEntity]), ProductModule],
  providers: [
    CartService,
    { provide: 'ICartRepository', useClass: CartRepository },
  ],
  controllers: [CartController],
  exports: [CartService, 'ICartRepository'],
})
export class CartModule {}
