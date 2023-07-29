import { Injectable, NotFoundException } from '@nestjs/common';
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

  findAll() {
    return this.shippingAddressRepository.find();
  }

  findUserAll(user: User) {
    return this.shippingAddressRepository.findBy({ user: { id: user.id } });
  }

  async findOneById(id: number) {
    const shippingAddress = await this.shippingAddressRepository.findOneBy({
      id,
    });
    if (!shippingAddress) throw new NotFoundException();
    return shippingAddress;
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

  async setOneAsDefault(id: number, user: User) {
    await this.resetDefault(user);
    return this.updateOne(id, { isDefault: true }, user);
  }

  resetDefault(user: User) {
    return this.shippingAddressRepository.update(
      { user, isDefault: true },
      { isDefault: false },
    );
  }
}
