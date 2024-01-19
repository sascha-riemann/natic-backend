import { Module } from '@nestjs/common';
import { UsersService } from './service/users.service';
import { User } from './entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './controller/user.controller';
import { BusinessService } from '../business/service/business.service';
import { Business } from '../business/entity/business.entity';
import { BusinessUserConfig } from '../business/entity/business-user-config.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Business, BusinessUserConfig])],
  providers: [UsersService, BusinessService],
  controllers: [UserController],
})
export class UsersModule {}
