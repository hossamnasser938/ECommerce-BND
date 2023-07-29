import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShippingAddress } from './shipping-address.entity';
import { ShippingAddressService } from './shipping-address.service';
import { ShippingAddressController } from './shipping-address.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ShippingAddress])],
  providers: [ShippingAddressService],
  exports: [ShippingAddressService],
  controllers: [ShippingAddressController],
})
export class ShippingAddressModule {}
