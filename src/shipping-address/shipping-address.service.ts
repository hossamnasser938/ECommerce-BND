import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ShippingAddress } from './shipping-address.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';
import { CreateShippingAddressDTO } from './models/create-shipping-address.dto';
import { UpdateShippingAddressDTO } from './models/update-shipping-address.dto';
import { checkTypeORMUpdateDeleteResult } from 'src/utils/helper-functions';

@Injectable()
export class ShippingAddressService {
  constructor(
    @InjectRepository(ShippingAddress)
    private shippingAddressRepository: Repository<ShippingAddress>,
  ) {}

  getAll() {
    return this.shippingAddressRepository.find();
  }

  getUserAll(user: User) {
    return this.shippingAddressRepository.findBy({ user });
  }

  getOneById(id: number) {
    return this.shippingAddressRepository.findOneBy({ id });
  }

  createOne(createShippingAddressDTO: CreateShippingAddressDTO, user: User) {
    const {
      city,
      area,
      street,
      building,
      apartment,
      isDefault = false,
    } = createShippingAddressDTO;

    const shippingAddress = new ShippingAddress();
    shippingAddress.city = city;
    shippingAddress.area = area;
    shippingAddress.street = street;
    shippingAddress.building = building;
    shippingAddress.apartment = apartment;
    shippingAddress.isDefault = isDefault;
    shippingAddress.user = user;

    return this.shippingAddressRepository.save(shippingAddress);
  }

  async updateOne(
    id: number,
    updateShippingAddressDTO: UpdateShippingAddressDTO,
    user: User,
  ) {
    const result = await this.shippingAddressRepository.update(
      { id, user },
      updateShippingAddressDTO,
    );
    return checkTypeORMUpdateDeleteResult(result);
  }

  async deleteOne(id: number, user: User) {
    const result = await this.shippingAddressRepository.delete({ id, user });
    return checkTypeORMUpdateDeleteResult(result);
  }
}
