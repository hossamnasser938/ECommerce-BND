import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ShippingAddressService } from './shipping-address.service';
import { Roles } from 'src/auth/auth.decorators';
import { Role } from 'src/auth/auth.enums';
import { RolesGuard } from 'src/auth/roles.guard';
import { User } from 'src/user/user.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateShippingAddressDTO } from './models/create-shipping-address.dto';
import { UpdateShippingAddressDTO } from './models/update-shipping-address.dto';
import { updateDeleteResponse } from 'src/utils/helper-functions';
import { Reflector } from '@nestjs/core';

@UseGuards(AuthGuard)
@Controller('shipping-addresses')
export class ShippingAddressController {
  constructor(
    @Inject(ShippingAddressService)
    private shippingAddressService: ShippingAddressService,
  ) {}

  @Roles(Role.Admin)
  @UseGuards(new RolesGuard(new Reflector()))
  @Get('all')
  getAllShippingAddresses() {
    return this.shippingAddressService.getAll();
  }

  @Get()
  getUserShippingAddresses(@Request() request) {
    const user = request.user as User;
    return this.shippingAddressService.getUserAll(user);
  }

  @Post()
  createOne(
    @Body() createShippingAddressDTO: CreateShippingAddressDTO,
    @Request() request,
  ) {
    const user = request.user as User;
    return this.shippingAddressService.createOne(
      createShippingAddressDTO,
      user,
    );
  }

  @Put(':id')
  async updateOne(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateShippingAddressDTO: UpdateShippingAddressDTO,
    @Request() request,
  ) {
    const user = request.user as User;
    const updatedSuccessfully = await this.shippingAddressService.updateOne(
      id,
      updateShippingAddressDTO,
      user,
    );
    return updateDeleteResponse(updatedSuccessfully);
  }

  @Delete(':id')
  async deleteOne(@Param('id', ParseIntPipe) id: number, @Request() request) {
    const user = request.user as User;
    const deletedSuccessfully = await this.shippingAddressService.deleteOne(
      id,
      user,
    );
    return updateDeleteResponse(deletedSuccessfully);
  }
}
