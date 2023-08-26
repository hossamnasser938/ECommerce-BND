import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartModule } from 'src/cart/cart.module';
import { OrderEntity } from 'src/core/data-layer/mysql-typeorm/entities/order.entity';
import { NotificationModule } from 'src/notification/notification.module';
import { ShippingAddressModule } from 'src/shipping-address/shipping-address.module';

import { ORDER_REPOSITORY_PROVIDER_TOKEN } from './order.constants';
import { OrderController } from './order.controller';
import { OrderRepository } from './order.repository';
import { OrderService } from './order.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity]),
    ShippingAddressModule,
    CartModule,
    NotificationModule,
  ],
  providers: [
    OrderService,
    { provide: ORDER_REPOSITORY_PROVIDER_TOKEN, useClass: OrderRepository },
  ],
  controllers: [OrderController],
  exports: [OrderService, ORDER_REPOSITORY_PROVIDER_TOKEN],
})
export class OrderModule {}
