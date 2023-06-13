import { Module } from '@nestjs/common';
import { UsersService } from './service/users.service';
import { User } from './entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './controller/user.controller';
import { BusinessService } from '../business/service/business.service';
import { BusinessEntity } from '../business/entity/business.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, BusinessEntity])],
  providers: [UsersService, BusinessService],
  controllers: [UserController],
})
export class UsersModule {}
