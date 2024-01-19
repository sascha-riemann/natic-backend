import { Injectable } from '@nestjs/common';
import {
  CreateProjectTask,
  ProjectTask,
  UpdateProjectTask,
} from './dto/project.task';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectTaskEntity } from './entities/project-task.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/service/users.service';
import { AuthenticatedUser } from '../authentication/decorators/user-decorator';
import { NaticService } from '../utils/natic.service';

@Injectable()
export class ProjectTaskService
  implements
    NaticService<
      ProjectTaskEntity,
      ProjectTask,
      UpdateProjectTask,
      CreateProjectTask
    >
{
  constructor(
    @InjectRepository(ProjectTaskEntity)
    private readonly projectTaskRepository: Repository<ProjectTaskEntity>,
    private readonly usersService: UsersService,
  ) {}

  async create(authenticatedUser: AuthenticatedUser, dto: CreateProjectTask) {
    const projectTask = new ProjectTaskEntity();
    projectTask.created = new Date();
    projectTask.creator = await this.usersService.findById(
      authenticatedUser.id,
    );
    void this.setAttributes(projectTask, dto, dto.assignedUser);
    return this.projectTaskRepository.save(projectTask).then((task) => task.id);
  }

  findAll(projectId: number) {
    return this.projectTaskRepository.find({
      where: {
        project: {
          id: projectId,
        },
      },
      relations: {
        assigned: true,
        creator: true,
      },
    });
  }

  findOne(id: number) {
    return this.projectTaskRepository.findOne({
      where: {
        id,
      },
      relations: {
        assigned: true,
        creator: true,
      },
    });
  }

  async update(id: number, dto: UpdateProjectTask) {
    const projectTask = await this.findOne(id);
    await this.setAttributes(projectTask, dto, dto.assignedUser);
    void this.projectTaskRepository.save(projectTask);
  }

  remove(id: number) {
    void this.projectTaskRepository.delete(id);
  }

  async setAttributes(
    projectTask: ProjectTaskEntity,
    dto: CreateProjectTask | UpdateProjectTask,
    assignedUserIds: number[],
  ): Promise<void> {
    projectTask.title = dto.title;
    projectTask.description = dto.description;
    projectTask.deadline = dto.deadline;
    projectTask.assigned = await Promise.all(
      assignedUserIds.map((userId) => this.usersService.findById(userId)),
    );
  }

  async entityToDTO(
    entity: ProjectTaskEntity,
    businessId: number,
  ): Promise<ProjectTask> {
    return {
      id: entity.id,
      title: entity.title,
      description: entity.description,
      deadline: entity.deadline,
      assignedUser: await Promise.all(
        entity.assigned.map((user) =>
          this.usersService.entityToDto(user, businessId),
        ),
      ),
    };
  }
}
