import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { ShippingAddressModule } from 'src/shipping-address/shipping-address.module';
import { CartModule } from 'src/cart/cart.module';
import { OrderEntity } from 'src/core/data-layer/mysql-typeorm/entities/order.entity';
import { OrderRepository } from './order.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity]),
    ShippingAddressModule,
    CartModule,
  ],
  providers: [
    OrderService,
    { provide: 'IOrderRepository', useClass: OrderRepository },
  ],
  controllers: [OrderController],
  exports: [OrderService, 'IOrderRepository'],
})
export class OrderModule {}
