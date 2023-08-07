import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IUser } from 'src/core/entities/user.entity.abstract';

import { ROLES_KEY } from './auth.decorators';
import { Role } from './auth.enums';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const requestRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requestRoles) {
      return true;
    }

    const authUser = request.user as IUser;
    const authUserRoles: Role[] = JSON.parse(authUser.roles);

    return requestRoles.some((role) => authUserRoles.includes(role));
  }
}
