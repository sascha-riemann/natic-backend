import { Role } from '../../role/dto/role.dto';

export interface UserDto {
  id: number;
  username?: string;
  email: string;
  firstName: string;
  lastName: string;
  workTimePerDay?: number;
  role: Role;
}

export interface CreateUserDto extends Omit<UserDto, 'id'> {
  password?: string;
}

export interface UpdateUserDto extends UserDto {
  password?: string;
}
