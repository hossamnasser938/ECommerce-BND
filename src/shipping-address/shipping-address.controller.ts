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
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from 'src/auth/auth.decorators';
import { Role } from 'src/auth/auth.enums';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { PaginationParamsDTO } from 'src/core/abstract-data-layer/dtos';
import { IUser } from 'src/core/entities/user.entity.abstract';
import { updateDeleteResponse } from 'src/utils/helper-functions';

import { CreateShippingAddressDTO } from './dtos/create-shipping-address.dto';
import { UpdateShippingAddressDTO } from './dtos/update-shipping-address.dto';
import { ShippingAddressService } from './shipping-address.service';

@UseGuards(AuthGuard)
@Controller('shipping-addresses')
export class ShippingAddressController {
  constructor(
    @Inject(ShippingAddressService)
    private readonly shippingAddressService: ShippingAddressService,
  ) {}

  @Roles(Role.Admin)
  @UseGuards(AuthGuard, new RolesGuard(new Reflector()))
  @Get('all')
  findAllShippingAddresses(
    @Query() paginationParametersDTO: PaginationParamsDTO,
  ) {
    return this.shippingAddressService.findAll(paginationParametersDTO);
  }

  @Get()
  findUserShippingAddresses(
    @Request() request,
    @Query() paginationParametersDTO: PaginationParamsDTO,
  ) {
    const user = request.user as IUser;
    return this.shippingAddressService.findUserAll(
      user.id,
      paginationParametersDTO,
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.shippingAddressService.findOneById(id);
  }

  @Post()
  createOne(
    @Body() createShippingAddressDTO: CreateShippingAddressDTO,
    @Request() request,
  ) {
    const user = request.user as IUser;
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
    const user = request.user as IUser;
    const updatedSuccessfully = await this.shippingAddressService.updateOne(
      id,
      updateShippingAddressDTO,
      user.id,
    );
    return updateDeleteResponse(updatedSuccessfully);
  }

  @Put(':id/set-default')
  async setAsDefault(
    @Param('id', ParseIntPipe) id: number,
    @Request() request,
  ) {
    const user = request.user as IUser;
    return this.shippingAddressService.setOneAsDefault(id, user.id);
  }

  @Delete(':id')
  async deleteOne(@Param('id', ParseIntPipe) id: number, @Request() request) {
    const user = request.user as IUser;
    const deletedSuccessfully = await this.shippingAddressService.deleteOne(
      id,
      user.id,
    );
    return updateDeleteResponse(deletedSuccessfully);
  }
}
