import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { IUser } from 'src/core/entities/user.entity.abstract';
import { CreateNotificationTokenDTO } from 'src/notification-token/dtos/create-notification-token.dto';
import { NotificationTokenService } from 'src/notification-token/notification-token.service';
import { DeviceType } from 'src/notification-token/notification-token.types';
import { CreateUserDTO } from 'src/user/dtos/create-user.dto';
import { UserService } from 'src/user/user.service';
import { ERROR_MESSAGES } from 'src/utils/error-messages';
import { updateDeleteResponse } from 'src/utils/helper-functions';

import { Role } from './auth.enums';
import { ChangePasswordDTO } from './dtos/change-password.dto';
import { ResendCodeDTO } from './dtos/resend-code.dto';
import { ResetPasswordDTO } from './dtos/reset-password.dto';
import { SignInDTO } from './dtos/signin.dto';
import { VerifyDTO } from './dtos/verify-signup-dto';
import { IAuthTokenPayload } from './types/auth-token-payload.model';
import { VerificationCodeService } from './verification-code/verification-code.service';

const SALT = 10;

@Injectable()
export class AuthService {
  constructor(
    @Inject(UserService) private readonly userService: UserService,
    @Inject(JwtService) private readonly jwtService: JwtService,
    @Inject(VerificationCodeService)
    private readonly verificationCodeService: VerificationCodeService,
    @Inject(NotificationTokenService)
    private readonly notificationTokenService: NotificationTokenService,
  ) {}

  private handleNotificationToken(
    notificationToken: string,
    deviceType: DeviceType,
    user: IUser,
  ) {
    if (notificationToken && !deviceType) {
      throw new BadRequestException(ERROR_MESSAGES.DEVICE_TYPE_MISSING);
    }

    if (!notificationToken && deviceType) {
      throw new BadRequestException(ERROR_MESSAGES.NOTIFICATION_TOKEN_MISSING);
    }

    const createNotificationTokenDTO: CreateNotificationTokenDTO = {
      value: notificationToken,
      deviceType,
    };

    if (notificationToken && deviceType) {
      this.notificationTokenService.createOneIfNoExists(
        createNotificationTokenDTO,
        user,
      );
    }
  }

  async signIn(signInDTO: SignInDTO) {
    const { email, password, notificationToken, deviceType } = signInDTO;

    const user = await this.userService.findOneByEmail(email);

    const samePassword = await compare(password, user.password);
    if (!samePassword) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    if (!user.verified)
      throw new ForbiddenException(ERROR_MESSAGES.VERIFY_ACCOUNT);

    this.handleNotificationToken(notificationToken, deviceType, user);

    const payload: IAuthTokenPayload = { sub: user.id, email: user.email };

    const jwt = this.jwtService.sign(payload);
    return { access_token: jwt };
  }

  async signUp(createUserDTO: CreateUserDTO, roles: Role[] = [Role.User]) {
    createUserDTO.password = await hash(createUserDTO.password, SALT);
    const user = await this.userService.createOne(createUserDTO, roles);
    await this.verificationCodeService.createAndSendOne(user);
    return user;
  }

  async verifySignUp(verifyDTO: VerifyDTO) {
    const { email, code } = verifyDTO;
    const user = await this.userService.findOneByEmail(email);

    if (user.verified)
      throw new ConflictException(ERROR_MESSAGES.ACCOUNT_ALREADY_VERIFIED);

    const isVerified = await this.verificationCodeService.verify(user.id, code);
    if (!isVerified) throw new InternalServerErrorException();

    const successfullyVerified = await this.userService.verifyUser(user.id);
    return updateDeleteResponse(successfullyVerified);
  }

  async resendCode(resendCode: ResendCodeDTO) {
    const { email } = resendCode;
    const user = await this.userService.findOneByEmail(email);

    return this.verificationCodeService.createAndSendOne(user);
  }

  async changePassword(changePasswordDTO: ChangePasswordDTO, user: IUser) {
    const { oldPassword, newPassword } = changePasswordDTO;

    const samePassword = await compare(oldPassword, user.password);
    if (!samePassword)
      throw new UnauthorizedException(ERROR_MESSAGES.INCORRECT_OLD_PASSWORD);

    if (oldPassword === newPassword)
      throw new ForbiddenException(ERROR_MESSAGES.SAME_PASSWORD);

    const hashedNewPassword = await hash(newPassword, SALT);

    return await this.userService.updateOne(user.id, {
      password: hashedNewPassword,
    });
  }

  async verifyForgetPassword(verifyDTO: VerifyDTO) {
    const { email, code } = verifyDTO;
    const user = await this.userService.findOneByEmail(email);

    const isVerified = await this.verificationCodeService.verify(user.id, code);
    if (!isVerified) throw new InternalServerErrorException();

    return (await this.verificationCodeService.createOne(user)).code;
  }

  async resetPassword(resetPasswordDTO: ResetPasswordDTO) {
    const { token, email, newPassword } = resetPasswordDTO;

    const user = await this.userService.findOneByEmail(email);

    const isVerified = await this.verificationCodeService.verify(
      user.id,
      token,
    );
    if (!isVerified) throw new InternalServerErrorException();

    const hashedNewPassword = await hash(newPassword, SALT);

    return await this.userService.updateOne(user.id, {
      password: hashedNewPassword,
    });
  }
}
