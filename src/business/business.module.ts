import { Module } from '@nestjs/common';
import { BusinessController } from './controller/business.controller';
import { BusinessService } from './service/business.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessEntity } from './entity/business.entity';
import { UsersService } from '../users/service/users.service';
import { User } from '../users/entity/user.entity';
import { RoleEntity } from '../role/entity/role.entity';

@Module({
  controllers: [BusinessController],
  providers: [BusinessService, UsersService],
  imports: [TypeOrmModule.forFeature([BusinessEntity, RoleEntity, User])],
})
export class BusinessModule {}
