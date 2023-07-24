import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Role } from './auth.enums';
import { ROLES_KEY } from './auth.decorators';
import { User } from 'src/user/user.entity';

export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const requestRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requestRoles) {
      return true;
    }

    const authUser = request.user as User;
    const authUserRoles: Role[] = JSON.parse(authUser.roles);

    return requestRoles.some((role) => authUserRoles.includes(role));
  }
}
