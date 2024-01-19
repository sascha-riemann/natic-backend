import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../../users/entity/user.entity';

export const AuthUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as AuthenticatedUser;
  },
);

export type AuthenticatedUser = User;
