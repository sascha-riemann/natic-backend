import { Injectable } from '@nestjs/common';
import { Equal, Repository } from 'typeorm';
import { RoleEntity } from '../entity/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessService } from '../../business/service/business.service';
import { Role, RoleCreate, RoleUpdate } from '../dto/role.dto';
import { BusinessPermissionsEntity } from '../entity/business-permissions.entity';
import { ProjectPermissionEntity } from '../entity/project-permissions.entity';
import { UsersService } from '../../users/service/users.service';
import { use } from 'passport';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    private readonly businessService: BusinessService,
    private readonly usersService: UsersService,
  ) {}

  async createRole(dto: RoleCreate, businessId: number): Promise<number> {
    const businessPermissions = new BusinessPermissionsEntity();
    businessPermissions.createProjects = dto.businessPermissions.createProjects;

    const projectPermissions = new ProjectPermissionEntity();
    projectPermissions.updateInformation =
      dto.projectPermissions.updateInformation;

    const role = new RoleEntity();
    role.name = dto.name;
    role.businessPermissions = businessPermissions;
    role.projectPermissions = projectPermissions;
    role.business = await this.businessService.findById(businessId);
    void this.setRoleUser(role, dto, businessId);

    const result = await this.roleRepository.save(role);
    return result.id;
  }

  async updateRole(
    roleId: number,
    dto: RoleUpdate,
    businessId: number,
  ): Promise<number> {
    const role = await this.getRole(businessId, roleId);
    role.name = dto.name;
    role.businessPermissions.createProjects =
      dto.businessPermissions.createProjects;
    role.projectPermissions.updateInformation =
      dto.projectPermissions.updateInformation;

    void this.setRoleUser(role, dto, businessId);

    const result = await this.roleRepository.save(role);
    return result.id;
  }

  private async setRoleUser(
    role: RoleEntity,
    dto: RoleUpdate | RoleCreate,
    businessId: number,
  ) {
    role.businessUserConfigs = await Promise.all(
      (dto.userIds || []).map(async (userId) => {
        const user = await this.usersService.getUser(userId, businessId);
        return user.businessUserConfigs.find(
          (c) => c.business.id === businessId,
        );
      }),
    );
  }

  async getRoles(businessId: number): Promise<Role[]> {
    if (!businessId) {
      throw new Error('no business id for roles');
    }
    const roles = await this.roleRepository.findBy({
      business: {
        id: businessId,
      },
    });
    return roles.map((role) => ({ id: role.id, name: role.name } as Role));
  }

  async getRole(businessId: number, roleId: number): Promise<RoleEntity> {
    if (!businessId || !roleId) {
      throw new Error('missing information');
    }
    return await this.roleRepository.findOne({
      where: [
        {
          id: roleId,
          business: {
            id: businessId,
          },
        },
      ],
      relations: {
        projectPermissions: true,
        businessPermissions: true,
        businessUserConfigs: {
          user: true,
        },
      },
    });
  }
}
