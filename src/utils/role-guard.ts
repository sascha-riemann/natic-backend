import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '../users/entity/user.entity';
import { PermissionKeys } from '../role/dto/role.dto';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<PermissionKeys[]>(
      'roles',
      context.getHandler(),
    );
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const businessId = Number(request.headers.businessid);
    const user: User = request.user;
    const config = user.businessUserConfigs.find(
      (c) => c.business.id === businessId,
    );
    if (config?.role) return false;
    const roleConfigs = {
      ...config.role.businessPermissions,
      ...config.role.projectPermissions,
    };

    const roleEntries = Object.entries(roleConfigs);

    const permit = !roles.some((role) =>
      roleEntries.some(([key, value]) => role === key && value === false),
    );

    if (!permit) {
      throw Error('No permission');
    }

    return permit;
  }
}
