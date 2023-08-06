import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { hash, compare } from 'bcrypt';
import { IAuthTokenPayload } from './models/auth-token-payload.model';
import { SignInDTO } from './models/signin.dto';
import { CreateUserDTO } from 'src/user/models/create-user.dto';
import { Role } from './auth.enums';
import { ChangePasswordDTO } from './models/change-password.dto';
import { VerificationCodeService } from './verification-code/verification-code.service';
import { VerifyDTO } from './models/verify-signup-dto';
import { updateDeleteResponse } from 'src/utils/helper-functions';
import { ResendCodeDTO } from './models/resend-code.dto';
import { ResetPasswordDTO } from './models/reset-password.dto';
import { ERROR_MESSAGES } from 'src/utils/error-messages';
import { IUser } from 'src/core/entities/user.entity.abstract';

const SALT = 10;

@Injectable()
export class AuthService {
  constructor(
    @Inject(UserService) private readonly userService: UserService,
    @Inject(JwtService) private readonly jwtService: JwtService,
    @Inject(VerificationCodeService)
    private readonly verificationCodeService: VerificationCodeService,
  ) {}

  async signIn(signInDTO: SignInDTO) {
    const { email, password } = signInDTO;

    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    const samePassword = await compare(password, user.password);
    if (!samePassword) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    if (!user.verified)
      throw new ForbiddenException(ERROR_MESSAGES.VERIFY_ACCOUNT);

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
    if (!user)
      throw new NotFoundException(
        ERROR_MESSAGES.ENTITY_NOT_FOUND('User', 'email', email),
      );

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
    if (!user)
      throw new NotFoundException(
        ERROR_MESSAGES.ENTITY_NOT_FOUND('User', 'email', email),
      );

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
    if (!user)
      throw new NotFoundException(
        ERROR_MESSAGES.ENTITY_NOT_FOUND('User', 'email', email),
      );

    const isVerified = await this.verificationCodeService.verify(user.id, code);
    if (!isVerified) throw new InternalServerErrorException();

    return (await this.verificationCodeService.createOne(user)).code;
  }

  async resetPassword(resetPasswordDTO: ResetPasswordDTO) {
    const { token, email, newPassword } = resetPasswordDTO;

    const user = await this.userService.findOneByEmail(email);
    if (!user)
      throw new NotFoundException(
        ERROR_MESSAGES.ENTITY_NOT_FOUND('User', 'email', email),
      );

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
