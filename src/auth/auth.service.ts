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
import { User } from 'src/user/user.entity';
import { VerificationCodeService } from './verification-code/verification-code.service';
import { VerifySignUpDTO } from './models/verify-signup-dto';
import { updateDeleteResponse } from 'src/utils/helper-functions';
import { ResendCodeDTO } from './models/resend-code.dto';

const SALT = 10;

@Injectable()
export class AuthService {
  constructor(
    @Inject(UserService) private userService: UserService,
    @Inject(JwtService) private jwtService: JwtService,
    @Inject(VerificationCodeService)
    private verificationCodeService: VerificationCodeService,
  ) {}

  async signIn(signInDTO: SignInDTO) {
    const { email, password } = signInDTO;

    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      throw new UnauthorizedException();
    }

    const samePassword = await compare(password, user.password);
    if (!samePassword) {
      throw new UnauthorizedException();
    }

    if (!user.verified)
      throw new ForbiddenException('Please verify youe account first');

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

  async verifySignUp(verifySignUpDTO: VerifySignUpDTO) {
    const { userId, verificationCode } = verifySignUpDTO;
    const user = await this.userService.findOneById(userId);
    if (!user) throw new NotFoundException(`No user with id = ${userId}`);

    if (user.verified) throw new ConflictException('User already verified');

    const isVerified = await this.verificationCodeService.verify(
      user,
      verificationCode,
    );
    if (!isVerified) throw new InternalServerErrorException();

    const successfullyVerified = await this.userService.verifyUser(userId);
    return updateDeleteResponse(successfullyVerified);
  }

  async resendCode(resendCode: ResendCodeDTO) {
    const { userId } = resendCode;
    const user = await this.userService.findOneById(userId);
    if (!user) throw new NotFoundException(`No user with id = ${userId}`);

    return this.verificationCodeService.createAndSendOne(user);
  }

  async changePassword(changePasswordDTO: ChangePasswordDTO, user: User) {
    const { oldPassword, newPassword } = changePasswordDTO;

    const samePassword = await compare(oldPassword, user.password);
    if (!samePassword)
      throw new UnauthorizedException('Incorrect old password');

    if (oldPassword === newPassword)
      throw new ForbiddenException('New password is the same old password');

    const hashedNewPassword = await hash(newPassword, SALT);

    return await this.userService.updateOne(user.id, {
      password: hashedNewPassword,
    });
  }
}
