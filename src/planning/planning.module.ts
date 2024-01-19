import { Module } from '@nestjs/common';
import { PlanningController } from './controller/planning.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Planning } from './entity/planning.entity';
import { Project } from '../project/entity/project.entity';
import { PlanningService } from './service/planning.service';
import { ProjectService } from '../project/service/project.service';
import { UsersService } from '../users/service/users.service';
import { User } from '../users/entity/user.entity';
import { BusinessService } from '../business/service/business.service';
import { Business } from '../business/entity/business.entity';
import { Resource } from '../resources/ressources/resource';
import { ResourcesService } from '../resources/service/resources.service';
import { ResourceCategory } from '../resources/ressources/resource.category';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Planning,
      Project,
      User,
      Business,
      Resource,
      ResourceCategory,
    ]),
  ],
  controllers: [PlanningController],
  providers: [
    PlanningService,
    ProjectService,
    UsersService,
    BusinessService,
    ResourcesService,
  ],
})
export class PlanningModule {}
