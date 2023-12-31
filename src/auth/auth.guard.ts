import {
  CanActivate,
  ExecutionContext,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserService } from 'src/user/user.service';

import { IAuthTokenPayload } from './types/auth-token-payload.model';

export class AuthGuard implements CanActivate {
  constructor(
    @Inject(JwtService) private readonly jwtService: JwtService,
    @Inject(UserService) private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const token = this.extractToken(request);
      if (!token) {
        throw new UnauthorizedException();
      }

      const payload = await this.jwtService.verifyAsync<IAuthTokenPayload>(
        token,
      );

      const user = await this.userService.findOneByEmail(payload.email);
      request.user = user;
      return true;
    } catch (err) {
      throw new UnauthorizedException();
    }
  }

  extractToken(request: Request): string {
    const [type, token] = request.headers.authorization.split(' ');
    return type === 'Bearer' ? token : '';
  }
}
