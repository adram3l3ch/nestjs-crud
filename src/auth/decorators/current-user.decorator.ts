import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../entities/user.entity.js';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const user: Omit<User, 'password'> = request.user;
    return user;
  },
);
