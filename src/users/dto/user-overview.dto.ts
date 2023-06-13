import { RoleOverviewDto } from '../../role/dto/role-overview.dto';

export interface UserOverviewDto {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: RoleOverviewDto;
}
