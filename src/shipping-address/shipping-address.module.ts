import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShippingAddressEntity } from 'src/core/data-layer/mysql-typeorm/entities/shipping-address.entity';

import { AreaModule } from './area/area.module';
import { CityModule } from './city/city.module';
import { SHIPPING_ADDRESS_REPOSITORY_PROVIDER_TOKEN } from './shipping-address.constants';
import { ShippingAddressController } from './shipping-address.controller';
import { ShippingAddressRepository } from './shipping-address.repository';
import { ShippingAddressService } from './shipping-address.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ShippingAddressEntity]),
    CityModule,
    AreaModule,
  ],
  providers: [
    ShippingAddressService,
    {
      provide: SHIPPING_ADDRESS_REPOSITORY_PROVIDER_TOKEN,
      useClass: ShippingAddressRepository,
    },
  ],
  controllers: [ShippingAddressController],
  exports: [ShippingAddressService, SHIPPING_ADDRESS_REPOSITORY_PROVIDER_TOKEN],
})
export class ShippingAddressModule {}
