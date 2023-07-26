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
import { User } from 'src/user/user.entity';
import { CreateUserDTO } from 'src/user/models/create-user.dto';
import { Role } from './auth.enums';
import { Roles } from './auth.decorators';
import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';
import { ChangePasswordDTO } from './models/change-password.dto';
import { updateDeleteResponse } from 'src/utils/helper-functions';

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
  signUp(@Body() createUserDTO: CreateUserDTO) {
    return this.authService.signUp(createUserDTO);
  }

  @Roles(Role.Admin)
  @UseGuards(AuthGuard, new RolesGuard(new Reflector()))
  @Post('signup-admin')
  signUpAdmin(@Body() createUserDTO: CreateUserDTO) {
    return this.authService.signUp(createUserDTO, [Role.Admin]);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  findAuthUser(@Request() request) {
    const { email } = request.user as User;
    return this.userService.findOneByEmail(email);
  }

  @UseGuards(AuthGuard)
  @Post('change-password')
  async changePassword(
    @Body() changePasswordDTO: ChangePasswordDTO,
    @Request() request,
  ) {
    const user = request.user as User;
    const successfullyChangedPassword = await this.authService.changePassword(
      changePasswordDTO,
      user,
    );
    return updateDeleteResponse(successfullyChangedPassword);
  }
}
