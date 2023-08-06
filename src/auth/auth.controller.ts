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
import { CreateUserDTO } from 'src/user/models/create-user.dto';
import { Role } from './auth.enums';
import { Roles } from './auth.decorators';
import { ChangePasswordDTO } from './models/change-password.dto';
import { updateDeleteResponse } from 'src/utils/helper-functions';
import { VerifyDTO } from './models/verify-signup-dto';
import { ResendCodeDTO } from './models/resend-code.dto';
import { ResetPasswordDTO } from './models/reset-password.dto';
import { IUser } from 'src/core/entities/user.entity.abstract';
import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';

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
