import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { RoleService } from '../service/role.service';
import { CreateRoleDto } from '../dto/create-role.dto';
import { RoleOverviewDto } from '../dto/role-overview.dto';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  createRole(@Body() createRole: CreateRoleDto): Promise<number> {
    return this.roleService.createRole(createRole);
  }

  @Get(':businessId')
  getRolesOverview(
    @Param('businessId') businessId: number,
  ): Promise<RoleOverviewDto> {
    return this.roleService.getRolesOverview(businessId);
  }

  @Delete(':roleId')
  deleteRole(roleId: number): void {
    // TODO: Only allow delete if no user has this role
    this.roleService.deleteRole(roleId);
  }
}
