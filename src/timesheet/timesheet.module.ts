import { Module } from '@nestjs/common';
import { TimesheetController } from './controller/timesheet.controller';
import { TimesheetService } from './service/timesheet.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimesheetEntry } from './entity/timesheet-entry.entity';
import { UsersService } from '../users/service/users.service';
import { ProjectService } from '../project/service/project.service';
import { User } from '../users/entity/user.entity';
import { Project } from '../project/entity/project.entity';
import { BusinessService } from '../business/service/business.service';
import { Business } from '../business/entity/business.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TimesheetEntry, User, Project, Business]),
  ],
  controllers: [TimesheetController],
  providers: [TimesheetService, UsersService, ProjectService, BusinessService],
})
export class TimesheetModule {}
