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
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateCartItemDTO } from './models/create-cart-item.dto';
import { updateDeleteResponse } from 'src/utils/helper-functions';
import { Roles } from 'src/auth/auth.decorators';
import { Role } from 'src/auth/auth.enums';
import { UpdateCartItemDTO } from './models/update-cart-item.dto';
import { UpdateCartItemAmountOperation } from './models/cart.enums';
import { IUser } from 'src/core/entities/user.entity.abstract';
import { RolesGuard } from 'src/auth/roles.guard';
import { Reflector } from '@nestjs/core';

@UseGuards(AuthGuard)
@Controller('cart')
export class CartController {
  constructor(@Inject(CartService) private readonly cartService: CartService) {}

  @Roles(Role.Admin)
  @UseGuards(AuthGuard, new RolesGuard(new Reflector()))
  @Get('all')
  findAll() {
    return this.cartService.findAll();
  }

  @Get()
  findUserAll(@Request() request) {
    const user = request.user as IUser;
    return this.cartService.findUserAll(user.id);
  }

  @Get('in-cart')
  findUserInCartItems(@Request() request) {
    const user = request.user as IUser;
    return this.cartService.findUserInCartItems(user.id);
  }

  @Post()
  createOne(@Body() createCartItemDTO: CreateCartItemDTO, @Req() request) {
    const user = request.user as IUser;
    return this.cartService.createOne(createCartItemDTO, user);
  }

  @Roles(Role.Admin)
  @UseGuards(AuthGuard, new RolesGuard(new Reflector()))
  @Put(':id')
  async updateOne(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCartItemDTO: UpdateCartItemDTO,
  ) {
    const successfullyUpdated = await this.cartService.updateOne(
      id,
      updateCartItemDTO,
    );
    return updateDeleteResponse(successfullyUpdated);
  }

  @Put(':id/increment')
  async incrementAmount(
    @Param('id', ParseIntPipe) id: number,
    @Request() request,
  ) {
    const user = request.user as IUser;
    const successfullyUpdated = await this.cartService.updateAmount(
      id,
      user.id,
      UpdateCartItemAmountOperation.INCREMENT,
    );
    return updateDeleteResponse(successfullyUpdated);
  }

  @Put(':id/decrement')
  async decrementAmount(
    @Param('id', ParseIntPipe) id: number,
    @Request() request,
  ) {
    const user = request.user as IUser;
    const successfullyUpdated = await this.cartService.updateAmount(
      id,
      user.id,
      UpdateCartItemAmountOperation.DECREMENT,
    );
    return updateDeleteResponse(successfullyUpdated);
  }

  @Delete(':id')
  async deleteOne(@Param('id', ParseIntPipe) id: number, @Request() request) {
    const user = request.user as IUser;
    const successfulllyDeleted = await this.cartService.deleteOne(id, user.id);
    return updateDeleteResponse(successfulllyDeleted);
  }

  @Post('empty')
  async emptyCart(@Req() request) {
    const user = request.user as IUser;
    const successfullyDeleted = await this.cartService.deleteAllUserInCartItems(
      user.id,
    );
    return updateDeleteResponse(successfullyDeleted);
  }
}
