import { Module } from '@nestjs/common';
import { BusinessController } from './controller/business.controller';
import { BusinessService } from './service/business.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Business } from './entity/business.entity';
import { UsersService } from '../users/service/users.service';
import { User } from '../users/entity/user.entity';
import { Resource } from '../resources/ressources/resource';
import { ResourceCategory } from '../resources/ressources/resource.category';
import { BusinessUserConfig } from './entity/business-user-config.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Business,
      BusinessUserConfig,
      User,
      Resource,
      ResourceCategory,
    ]),
  ],
  providers: [UsersService, BusinessService],
  controllers: [BusinessController],
})
export class BusinessModule {}
