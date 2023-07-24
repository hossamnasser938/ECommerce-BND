import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { hash, compare } from 'bcrypt';

const SALT = 10;

@Injectable()
export class AuthService {
  constructor(
    @Inject(UserService) private userService: UserService,
    @Inject(JwtService) private jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string) {
    const user = await this.userService.findOne(email);

    if (!user) {
      throw new UnauthorizedException();
    }

    const samePassword = await compare(password, user.password);
    if (!samePassword) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id, email: user.email };

    const jwt = this.jwtService.sign(payload);
    return { access_token: jwt };
  }

  async signUp(email: string, password: string, name: string) {
    const hashedPassword = await hash(password, SALT);

    return this.userService.createOne(email, hashedPassword, name);
  }
}
