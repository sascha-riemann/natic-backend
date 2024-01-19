import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProjectTaskService } from './project-task.service';
import { CreateProjectTask, UpdateProjectTask } from './dto/project.task';
import {
  AuthenticatedUser,
  AuthUser,
} from '../authentication/decorators/user-decorator';
import { BusinessId } from '../business/decorator/business.decorator';

@Controller('project-task')
export class ProjectTaskController {
  constructor(private readonly projectTaskService: ProjectTaskService) {}

  @Post()
  create(
    @AuthUser() authenticatedUser: AuthenticatedUser,
    @Body() dto: CreateProjectTask,
  ) {
    return this.projectTaskService.create(authenticatedUser, dto);
  }

  @Get()
  async findAll(
    @Param('projectId') projectId: number,
    @BusinessId() businessId: number,
  ) {
    const tasks = await this.projectTaskService.findAll(projectId);
    return tasks.map((task) =>
      this.projectTaskService.entityToDTO(task, businessId),
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @BusinessId() businessId: number) {
    const task = await this.projectTaskService.findOne(+id);
    return this.projectTaskService.entityToDTO(task, businessId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Param('projectId') projectId: number,
    @Body() dto: UpdateProjectTask,
  ) {
    return this.projectTaskService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.projectTaskService.remove(+id);
  }
}
