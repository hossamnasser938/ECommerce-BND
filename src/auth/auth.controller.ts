import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from 'src/auth/auth.guard';
import { IUser } from 'src/core/entities/user.entity.abstract';
import { CreateUserDTO } from 'src/user/dtos/create-user.dto';
import { updateDeleteResponse } from 'src/utils/helper-functions';

import { Roles } from './auth.decorators';
import { Role } from './auth.enums';
import { AuthService } from './auth.service';
import { ChangePasswordDTO } from './dtos/change-password.dto';
import { ResendCodeDTO } from './dtos/resend-code.dto';
import { ResetPasswordDTO } from './dtos/reset-password.dto';
import { SignInDTO } from './dtos/signin.dto';
import { VerifyDTO } from './dtos/verify-signup-dto';
import { RolesGuard } from './roles.guard';

@Controller('auth')
export class AuthController {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

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

  @Post('verify-signup')
  verifySignup(@Body() verifyDTO: VerifyDTO) {
    return this.authService.verifySignUp(verifyDTO);
  }

  @Post('resend-code')
  async resendCode(@Body() resendCodeDTO: ResendCodeDTO) {
    const verificationCode = await this.authService.resendCode(resendCodeDTO);
    return updateDeleteResponse(!!verificationCode);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  findAuthUser(@Request() request) {
    const user = request.user as IUser;
    return user;
  }

  @UseGuards(AuthGuard)
  @Post('change-password')
  async changePassword(
    @Body() changePasswordDTO: ChangePasswordDTO,
    @Request() request,
  ) {
    const user = request.user as IUser;
    const successfullyChangedPassword = await this.authService.changePassword(
      changePasswordDTO,
      user,
    );
    return updateDeleteResponse(successfullyChangedPassword);
  }

  @Post('forget-password')
  async forgetPassword(@Body() resendCodeDTO: ResendCodeDTO) {
    const successfullyChangedPassword = await this.authService.resendCode(
      resendCodeDTO,
    );
    return updateDeleteResponse(!!successfullyChangedPassword);
  }

  @Post('verify-forget-password')
  async verifyForgetPassword(@Body() verifyDTO: VerifyDTO) {
    const verifciationCode = await this.authService.verifyForgetPassword(
      verifyDTO,
    );
    return { token: verifciationCode };
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDTO: ResetPasswordDTO) {
    const resettedSuccessfully = await this.authService.resetPassword(
      resetPasswordDTO,
    );
    return updateDeleteResponse(resettedSuccessfully);
  }
}
