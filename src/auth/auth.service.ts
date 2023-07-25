import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { hash, compare } from 'bcrypt';
import { IAuthTokenPayload } from './models/auth-token-payload.model';
import { SignInDTO } from './models/signin.dto';
import { SignUpDTO } from './models/signup.dto';

const SALT = 10;

@Injectable()
export class AuthService {
  constructor(
    @Inject(UserService) private userService: UserService,
    @Inject(JwtService) private jwtService: JwtService,
  ) {}

  async signIn(signInDTO: SignInDTO) {
    const { email, password } = signInDTO;

    const user = await this.userService.findOne(email);

    if (!user) {
      throw new UnauthorizedException();
    }

    const samePassword = await compare(password, user.password);
    if (!samePassword) {
      throw new UnauthorizedException();
    }

    const payload: IAuthTokenPayload = { sub: user.id, email: user.email };

    const jwt = this.jwtService.sign(payload);
    return { access_token: jwt };
  }

  async signUp(signUpDTO: SignUpDTO) {
    const { email, password, name } = signUpDTO;

    const hashedPassword = await hash(password, SALT);

    return this.userService.createOne(email, hashedPassword, name);
  }
}
