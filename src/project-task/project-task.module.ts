import { Module } from '@nestjs/common';
import { ProjectTaskService } from './project-task.service';
import { ProjectTaskController } from './project-task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entity/user.entity';
import { ProjectTaskEntity } from './entities/project-task.entity';
import { UsersService } from '../users/service/users.service';
import { Business } from '../business/entity/business.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, ProjectTaskEntity, Business])],
  controllers: [ProjectTaskController],
  providers: [ProjectTaskService, UsersService],
})
export class ProjectTaskModule {}
