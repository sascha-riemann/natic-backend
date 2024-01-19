import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BusinessId } from '../../business/decorator/business.decorator';
import { RoleService } from '../service/role.service';
import { Role, RoleCreate, RoleUpdate } from '../dto/role.dto';
import { UserDto } from '../../users/dto/user.dto';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  private createRole(
    @BusinessId() businessId: number,
    @Body() dto: RoleCreate,
  ): Promise<number> {
    return this.roleService.createRole(dto, businessId);
  }

  @Post(':roleId')
  private updateRole(
    @BusinessId() businessId: number,
    @Body() dto: RoleUpdate,
    @Param('roleId') roleId: number,
  ): Promise<number> {
    return this.roleService.updateRole(roleId, dto, businessId);
  }

  @Get()
  private getRoles(@BusinessId() businessId: number): Promise<Role[]> {
    return this.roleService.getRoles(businessId);
  }

  @Get(':roleId')
  private async getRole(
    @BusinessId() businessId: number,
    @Param('roleId') roleId: number,
  ): Promise<Role> {
    const role = await this.roleService.getRole(businessId, Number(roleId));
    return {
      id: role.id,
      name: role.name,
      businessPermissions: role.businessPermissions,
      projectPermissions: role.projectPermissions,
      users: role.businessUserConfigs.map(
        (c) =>
          ({
            id: c.user.id,
            email: c.user.email,
            username: c.user.username,
            workTimePerDay: c.workTimePerDay,
            lastName: c.user.lastName,
            firstName: c.user.firstName,
          } as UserDto),
      ),
    } as Role;
  }
}
