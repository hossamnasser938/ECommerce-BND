import {
  Body,
  Controller,
  Inject,
  Post,
  Get,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AuthService) private authService: AuthService,
    @Inject(UserService) private userService: UserService,
  ) {}

  @Post('signin')
  signIn(@Body('email') email: string, @Body('password') password: string) {
    return this.authService.signIn(email, password);
  }

  @Post('signup')
  signUp(
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('name') name: string,
  ) {
    return this.authService.signUp(email, password, name);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  findAuthUser(@Request() request) {
    const { email } = request.user;
    return this.userService.findOne(email);
  }
}
