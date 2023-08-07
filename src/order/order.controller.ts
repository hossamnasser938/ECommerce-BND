import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
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

import { CreateOrderDTO } from './dtos/create-order.dto';
import { OrderService } from './order.service';

@UseGuards(AuthGuard)
@Controller('orders')
export class OrderController {
  constructor(
    @Inject(OrderService) private readonly orderService: OrderService,
  ) {}

  @Roles(Role.Admin)
  @UseGuards(AuthGuard, new RolesGuard(new Reflector()))
  @Get('all')
  findAll(@Query() paginationParametersDTO: PaginationParamsDTO) {
    return this.orderService.findAll(paginationParametersDTO);
  }

  @Get()
  findUserOrders(
    @Request() request,
    @Query() paginationParametersDTO: PaginationParamsDTO,
  ) {
    const user = request.user as IUser;
    return this.orderService.findUserAll(user.id, paginationParametersDTO);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.findOneById(id);
  }

  @Post()
  createOne(@Body() createOrderDTO: CreateOrderDTO, @Request() request) {
    const user = request.user as IUser;
    return this.orderService.createOne(createOrderDTO, user);
  }

  @Roles(Role.Admin)
  @UseGuards(AuthGuard, new RolesGuard(new Reflector()))
  @Delete(':id')
  async deleteOne(@Param('id', ParseIntPipe) id: number) {
    const deletedSuccessfully = await this.orderService.deleteOne(id);
    return updateDeleteResponse(deletedSuccessfully);
  }
}
