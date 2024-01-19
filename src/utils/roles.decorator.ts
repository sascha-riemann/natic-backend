import { PermissionKeys } from '../role/dto/role.dto';
import { SetMetadata } from '@nestjs/common';

export const Roles = (...permissionKeys: PermissionKeys[]) =>
  SetMetadata('roles', permissionKeys);
