import { Module } from '@nestjs/common';
import { ProjectController } from './controller/project.controller';
import { ProjectService } from './service/project.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entity/project.entity';
import { UsersService } from '../users/service/users.service';
import { User } from '../users/entity/user.entity';
import { Planning } from '../planning/entity/planning.entity';
import { BusinessService } from '../business/service/business.service';
import { Business } from '../business/entity/business.entity';

@Module({
  controllers: [ProjectController],
  providers: [ProjectService, UsersService, BusinessService],
  imports: [TypeOrmModule.forFeature([Project, User, Planning, Business])],
})
export class ProjectModule {}
