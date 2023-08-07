import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShippingAddressEntity } from 'src/core/data-layer/mysql-typeorm/entities/shipping-address.entity';

import { ShippingAddressController } from './shipping-address.controller';
import { ShippingAddressRepository } from './shipping-address.repository';
import { ShippingAddressService } from './shipping-address.service';

@Module({
  imports: [TypeOrmModule.forFeature([ShippingAddressEntity])],
  providers: [
    ShippingAddressService,
    {
      provide: 'IShippingAddressRepository',
      useClass: ShippingAddressRepository,
    },
  ],
  controllers: [ShippingAddressController],
  exports: [ShippingAddressService, 'IShippingAddressRepository'],
})
export class ShippingAddressModule {}
