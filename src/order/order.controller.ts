import {
  Controller,
  Get,
  Inject,
  UseGuards,
  Request,
  Post,
  Body,
  Delete,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { Roles } from 'src/auth/auth.decorators';
import { Role } from 'src/auth/auth.enums';
import { CreateOrderDTO } from './models/create-order.dto';
import { updateDeleteResponse } from 'src/utils/helper-functions';
import { AuthGuard } from 'src/auth/auth.guard';
import { IUser } from 'src/core/entities/user.entity.abstract';
import { RolesGuard } from 'src/auth/roles.guard';
import { Reflector } from '@nestjs/core';

@UseGuards(AuthGuard)
@Controller('orders')
export class OrderController {
  constructor(
    @Inject(OrderService) private readonly orderService: OrderService,
  ) {}

  @Roles(Role.Admin)
  @UseGuards(AuthGuard, new RolesGuard(new Reflector()))
  @Get('all')
  findAll() {
    return this.orderService.findAll();
  }

  @Get()
  findUserOrders(@Request() request) {
    const user = request.user as IUser;
    return this.orderService.findUserAll(user.id);
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
