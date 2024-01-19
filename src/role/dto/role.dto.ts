import { UserDto } from '../../users/dto/user.dto';

export interface Role {
  id: number;
  name: string;
  businessPermissions: BusinessPermissions;
  projectPermissions: ProjectPermissions;
  users?: UserDto[];
}

export interface RoleUpdate {
  id: number;
  name: string;
  businessPermissions: BusinessPermissions;
  projectPermissions: ProjectPermissions;
  userIds: number[];
}

export type RoleCreate = Omit<RoleUpdate, 'id'>;

export enum PermissionKeys {
  BUSINESS_CREATE_PROJECTS = 'createProjects',
  PROJECT_UPDATE_INFORMATION = 'updateInformation',
}

export interface BusinessPermissions {
  [PermissionKeys.BUSINESS_CREATE_PROJECTS]: boolean;
}

export interface ProjectPermissions {
  [PermissionKeys.PROJECT_UPDATE_INFORMATION]: boolean;
}
