import {
  Body,
  Controller,
  Get,
  Param,
  Headers,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProjectService } from '../service/project.service';
import {
  AuthenticatedUser,
  AuthUser,
} from '../../authentication/decorators/user-decorator';
import { JwtAuthGuard } from '../../authentication/guard/JwtAuthGuard';
import { ProjectCreateDto } from '../dto/project-create.dto';
import { Projects } from '../dto/projects.dto';
import { ProjectOverview } from '../dto/project-overview';
import { ProjectStaffOverviewDto } from '../dto/project-staff.dto';
import { ProjectScheduleDto } from '../dto/project-schedule.dto';
import { Schedule } from '../entity/schedule.entity';
import { BusinessId } from '../../business/decorator/business.decorator';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  createProject(
    @AuthUser() user: AuthenticatedUser,
    @BusinessId() businessId: number,
    @Body() projectDTO: ProjectCreateDto,
  ): Promise<number> {
    if (businessId) {
      return this.projectService.create(user.userId, projectDTO, businessId);
    }
  }

  @Post(':projectId')
  @UseGuards(JwtAuthGuard)
  updateProject(
    @AuthUser() user: AuthenticatedUser,
    @Param('projectId') projectId: number,
    @Body() projectDTO: ProjectCreateDto,
  ): Promise<void> {
    return this.projectService.update(user.userId, projectDTO, projectId);
  }

  @Get('list')
  @UseGuards(JwtAuthGuard)
  getProjectList(
    @AuthUser() user: AuthenticatedUser,
    @BusinessId() businessId: number,
  ): Promise<Projects> {
    return this.projectService.getList(user.userId, businessId);
  }

  @Get(':projectId/staff/overview')
  @UseGuards(JwtAuthGuard)
  getStaffOverview(
    @AuthUser() user: AuthenticatedUser,
    @Param('constructionSiteId') constructionSiteId: number,
  ): Promise<ProjectStaffOverviewDto> {
    return this.projectService.getStaffOverview(constructionSiteId);
  }

  @Get(':projectId/overview')
  @UseGuards(JwtAuthGuard)
  getConstructionSiteOverview(
    @AuthUser() user: AuthenticatedUser,
    @Param('projectId') projectId: number,
  ): Promise<ProjectOverview> {
    return this.projectService.getOverview(user.userId, projectId);
  }

  @Get(':projectId/schedules')
  @UseGuards(JwtAuthGuard)
  getProjectSchedules(
    @AuthUser() user: AuthenticatedUser,
    @Param('projectId') projectId: number,
  ): Promise<Schedule[]> {
    return this.projectService.getSchedules(projectId);
  }

  @Post(':projectId/schedule')
  @UseGuards(JwtAuthGuard)
  addProjectSchedule(
    @AuthUser() user: AuthenticatedUser,
    @Param('projectId') projectId: number,
    @Body() projectScheduleDTO: ProjectScheduleDto,
  ): Promise<void> {
    return this.projectService.createSchedule(
      user.userId,
      projectScheduleDTO,
      projectId,
    );
  }
}
