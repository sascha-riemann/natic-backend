import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ProjectService } from '../service/project.service';
import {
  AuthenticatedUser,
  AuthUser,
} from '../../authentication/decorators/user-decorator';
import { JwtAuthGuard } from '../../authentication/guard/JwtAuthGuard';
import { BusinessId } from '../../business/decorator/business.decorator';
import { ProjectCreateDto, ProjectDTO } from '../dto/project.dto';
import { User } from '../../users/entity/user.entity';
import { UserDto } from '../../users/dto/user.dto';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  // @Roles(PermissionKeys.BUSINESS_CREATE_PROJECTS)
  // @UseGuards(JwtAuthGuard, RoleGuard)
  createProject(
    @AuthUser() user: AuthenticatedUser,
    @BusinessId() businessId: number,
    @Body() projectDTO: ProjectCreateDto,
  ): Promise<number> {
    if (businessId) {
      return this.projectService.create(user.id, projectDTO, businessId);
    }
  }

  @Post(':projectId')
  @UseGuards(JwtAuthGuard)
  updateProject(
    @AuthUser() user: AuthenticatedUser,
    @Param('projectId') projectId: number,
    @Body() projectDTO: ProjectCreateDto,
  ): Promise<void> {
    return this.projectService.update(user.id, projectDTO, projectId);
  }

  @Get('list')
  @UseGuards(JwtAuthGuard)
  getProjectList(
    @AuthUser() user: AuthenticatedUser,
    @BusinessId() businessId: number,
  ): Promise<ProjectDTO[]> {
    return this.projectService.getList(user.id, businessId);
  }

  @Get(':projectId/users')
  @UseGuards(JwtAuthGuard)
  getUsers(@Param('projectId') projectId: number): Promise<UserDto[]> {
    return this.projectService.getUsers(projectId);
  }

  @Post(':projectId/users')
  @UseGuards(JwtAuthGuard)
  setUsers(
    @Param('projectId') projectId: number,
    @Body() userIds: number[],
  ): Promise<void> {
    return this.projectService.setUsers(projectId, userIds);
  }

  @Get(':projectId/overview')
  @UseGuards(JwtAuthGuard)
  getProjectOverview(
    @Param('projectId') projectId: number,
  ): Promise<ProjectDTO> {
    return this.projectService.getOverview(projectId);
  }
}
