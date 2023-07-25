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
import { SignInDTO } from './models/signin.dto';
import { SignUpDTO } from './models/signup.dto';
import { User } from 'src/user/user.entity';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AuthService) private authService: AuthService,
    @Inject(UserService) private userService: UserService,
  ) {}

  @Post('signin')
  signIn(@Body() signInDTO: SignInDTO) {
    return this.authService.signIn(signInDTO);
  }

  @Post('signup')
  signUp(@Body() signUpDTO: SignUpDTO) {
    return this.authService.signUp(signUpDTO);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  findAuthUser(@Request() request) {
    const { email } = request.user as User;
    return this.userService.findOne(email);
  }
}
