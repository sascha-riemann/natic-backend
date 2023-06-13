import { Module } from '@nestjs/common';
import { RoleController } from './controller/role.controller';
import { RoleService } from './service/role.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from './entity/role.entity';
import { BusinessService } from '../business/service/business.service';
import { BusinessEntity } from '../business/entity/business.entity';
import { UsersService } from '../users/service/users.service';
import { User } from '../users/entity/user.entity';
import { ProjectPermission } from './entity/project-permission.entity';
import { OrganizationPermission } from './entity/organization-permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RoleEntity,
      BusinessEntity,
      User,
      ProjectPermission,
      OrganizationPermission,
    ]),
  ],
  controllers: [RoleController],
  providers: [RoleService, BusinessService, UsersService],
})
export class RoleModule {}
