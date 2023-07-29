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
import { User } from 'src/user/user.entity';
import { CreateCartItemDTO } from './models/create-cart-item.dto';
import { updateDeleteResponse } from 'src/utils/helper-functions';
import { Roles } from 'src/auth/auth.decorators';
import { Role } from 'src/auth/auth.enums';
import { RolesGuard } from 'src/auth/roles.guard';
import { Reflector } from '@nestjs/core';
import { UpdateCartItemDTO } from './models/update-cart-item.dto';
import { UpdateCartItemAmountOperation } from './models/cart.enums';

@UseGuards(AuthGuard)
@Controller('cart')
export class CartController {
  constructor(@Inject(CartService) private cartService: CartService) {}

  @Roles(Role.Admin)
  @UseGuards(new RolesGuard(new Reflector()))
  @Get('all')
  findAll() {
    return this.cartService.findAll();
  }

  @Get()
  findUserAll(@Request() request) {
    const user = request.user as User;
    return this.cartService.findUserAll(user);
  }

  @Get('in-cart')
  findUserInCartItems(@Request() request) {
    const user = request.user as User;
    return this.cartService.findUserInCartItems(user);
  }

  @Post()
  createOne(@Body() createCartItemDTO: CreateCartItemDTO, @Req() request) {
    const user = request.user as User;
    return this.cartService.createOne(createCartItemDTO, user);
  }

  @Roles(Role.Admin)
  @UseGuards(new RolesGuard(new Reflector()))
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
    const user = request.user as User;
    const successfullyUpdated = await this.cartService.updateAmount(
      id,
      user,
      UpdateCartItemAmountOperation.INCREMENT,
    );
    return updateDeleteResponse(successfullyUpdated);
  }

  @Put(':id/decrement')
  async decrementAmount(
    @Param('id', ParseIntPipe) id: number,
    @Request() request,
  ) {
    const user = request.user as User;
    const successfullyUpdated = await this.cartService.updateAmount(
      id,
      user,
      UpdateCartItemAmountOperation.DECREMENT,
    );
    return updateDeleteResponse(successfullyUpdated);
  }

  @Delete(':id')
  async deleteOne(@Param('id', ParseIntPipe) id: number, @Request() request) {
    const user = request.user as User;
    const successfulllyDeleted = await this.cartService.deleteOne(id, user);
    return updateDeleteResponse(successfulllyDeleted);
  }

  @Post('empty')
  async emptyCart(@Req() request) {
    const user = request.user as User;
    const successfullyDeleted = await this.cartService.deleteAllUserInCartItems(
      user,
    );
    return updateDeleteResponse(successfullyDeleted);
  }
}
