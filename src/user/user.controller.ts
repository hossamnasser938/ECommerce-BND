import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(@Inject(UserService) private userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Post()
  createOne(
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('email') name: string,
  ) {
    return this.userService.createOne(email, password, name);
  }
}
