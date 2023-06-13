import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from '../entity/role.entity';
import { CreateRoleDto } from '../dto/create-role.dto';
import { BusinessService } from '../../business/service/business.service';
import { RoleOverviewDto } from '../dto/role-overview.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    private readonly organizationService: BusinessService,
  ) {}
  async createRole(createRoleDto: CreateRoleDto): Promise<number> {
    const business = await this.organizationService.findById(
      createRoleDto.businessId,
    );

    const role = new RoleEntity();
    role.name = createRoleDto.name;
    role.business = business;
    return this.roleRepository.save(role).then((r) => r.id);
  }

  async getRolesOverview(organizationId: number): Promise<RoleOverviewDto> {
    const organization = await this.organizationService.findById(
      organizationId,
    );
    return organization.roles?.map((role) => ({
      id: role.id,
      name: role.name,
    }));
  }

  deleteRole(roleId: number): void {
    void this.roleRepository.delete({
      id: roleId,
    });
  }
}
