import { Module } from '@nestjs/common';
import { PlanningController } from './controller/planning.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Planning } from './entity/planning.entity';
import { Project } from '../project/entity/project.entity';
import { PlanningService } from './service/planning.service';
import { ProjectService } from '../project/service/project.service';
import { UsersService } from '../users/service/users.service';
import { Schedule } from '../project/entity/schedule.entity';
import { User } from '../users/entity/user.entity';
import { BusinessService } from '../business/service/business.service';
import { BusinessEntity } from '../business/entity/business.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Planning,
      Project,
      Schedule,
      User,
      BusinessEntity,
    ]),
  ],
  controllers: [PlanningController],
  providers: [PlanningService, ProjectService, UsersService, BusinessService],
})
export class PlanningModule {}
