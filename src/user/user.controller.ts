import { Controller, Get, Inject } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(@Inject(UserService) private userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }
}
