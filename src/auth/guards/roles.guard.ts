import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles, ROLES_KEY } from '../decorators/roles.decorator.js';
import { User, UserRole } from '../entities/user.entity.js';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const roles = this.reflector.get<UserRole[]>(
      ROLES_KEY,
      context.getHandler(),
    );

    if (!roles) return true;

    const request = context.switchToHttp().getRequest();
    const user: Omit<User, 'password'> = request.user;

    const hasRequiredRole = roles.includes(user.role);
    if (!hasRequiredRole) {
      throw new UnauthorizedException('No enough permission');
    }
    return hasRequiredRole;
  }
}
