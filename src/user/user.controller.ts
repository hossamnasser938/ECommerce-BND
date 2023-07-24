import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/auth.decorators';
import { Role } from 'src/auth/auth.enums';
import { RolesGuard } from 'src/auth/roles.guard';
import { Reflector } from '@nestjs/core';

@Controller('users')
export class UserController {
  constructor(@Inject(UserService) private userService: UserService) {}

  @UseGuards(AuthGuard, new RolesGuard(new Reflector()))
  @Roles(Role.Admin)
  @Get()
  findAll() {
    return this.userService.findAll();
  }
}
