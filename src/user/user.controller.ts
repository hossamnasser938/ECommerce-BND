import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/auth.decorators';
import { Role } from 'src/auth/auth.enums';
import { UpdateUserDTO } from './models/update-user.dto';
import { updateDeleteResponse } from 'src/utils/helper-functions';
import { RolesGuard } from 'src/auth/roles.guard';
import { Reflector } from '@nestjs/core';

@Controller('users')
@Roles(Role.Admin)
@UseGuards(AuthGuard, new RolesGuard(new Reflector()))
export class UserController {
  constructor(@Inject(UserService) private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Put(':id')
  async updateOne(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDTO: UpdateUserDTO,
  ) {
    const successfullyUpdated = await this.userService.updateOne(
      id,
      updateUserDTO,
    );

    return updateDeleteResponse(successfullyUpdated);
  }

  @Delete(':id')
  async deleteOne(@Param('id', ParseIntPipe) id: number) {
    const successfullyDeleted = await this.userService.deleteOne(id);

    return updateDeleteResponse(successfullyDeleted);
  }
}
