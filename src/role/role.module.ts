import { Module } from '@nestjs/common';
import { RoleController } from './controller/role.controller';
import { RoleService } from './service/role.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from './entity/role.entity';
import { Business } from '../business/entity/business.entity';
import { BusinessService } from '../business/service/business.service';
import { User } from '../users/entity/user.entity';
import { UsersService } from '../users/service/users.service';
import { ProjectPermissionEntity } from './entity/project-permissions.entity';
import { BusinessPermissionsEntity } from './entity/business-permissions.entity';
import { BusinessUserConfig } from '../business/entity/business-user-config.entity';

@Module({
  controllers: [RoleController],
  providers: [RoleService, BusinessService, UsersService],
  imports: [
    TypeOrmModule.forFeature([
      RoleEntity,
      ProjectPermissionEntity,
      BusinessPermissionsEntity,
      BusinessUserConfig,
      Business,
      User,
    ]),
  ],
})
export class RoleModule {}
