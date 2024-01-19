import { Module } from '@nestjs/common';
import { ResourcesController } from './controller/resources.controller';
import { ResourcesService } from './service/resources.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resource } from './ressources/resource';
import { ResourceCategory } from './ressources/resource.category';
import { BusinessService } from '../business/service/business.service';
import { Business } from '../business/entity/business.entity';
import { User } from '../users/entity/user.entity';
import { UsersService } from '../users/service/users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Resource,
      ResourceCategory,
      Business,
      User,
    ]),
  ],
  controllers: [ResourcesController],
  providers: [ResourcesService, BusinessService, UsersService],
})
export class ResourcesModule {}
