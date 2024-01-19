import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Project } from '../entity/project.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '../../users/service/users.service';
import { BusinessService } from '../../business/service/business.service';
import { UserDto } from '../../users/dto/user.dto';
import { ProjectCreateDto, ProjectDTO } from '../dto/project.dto';

@Injectable()
export class ProjectService {
  constructor(
    private readonly userService: UsersService,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly businessService: BusinessService,
  ) {}

  async create(
    userId: number,
    dto: ProjectCreateDto,
    businessId: number,
  ): Promise<number> {
    const user = await this.userService.findById(userId);
    const business = await this.businessService.findById(businessId);

    // TODO: Check if already exists
    return this.projectRepository
      .save({
        name: dto.name,
        address: dto.address,
        created: new Date(),
        description: dto.description,
        user: [user],
        business,
      })
      .then((r) => r.id);
  }

  findById(id: number): Promise<Project> {
    if (!id) return undefined;
    return this.projectRepository.findOne({
      where: { id },
      relations: {
        user: {
          businessUserConfigs: {
            role: true,
          },
        },
      },
    });
  }

  async update(
    userId: number,
    dto: ProjectCreateDto,
    projectId: number,
  ): Promise<void> {
    const project = await this.findById(projectId);
    project.name = dto.name;
    project.address = dto.address;
    project.description = dto.description;
    void this.projectRepository.save(project);
  }

  async getList(userId: number, businessId): Promise<ProjectDTO[]> {
    const projects = await this.projectRepository.find({
      where: {
        business: {
          id: businessId,
        },
        user: {
          id: userId,
        },
      },
    });
    return projects
      .sort((a, b) => b.created.getTime() - a.created.getTime())
      .map((project: Project) => ({
        id: project.id,
        name: project.name,
        description: project.description,
      })) as ProjectDTO[];
  }

  async getUsers(projectId: number): Promise<UserDto[]> {
    const project = await this.findById(projectId);
    return project?.user?.map((user) => {
      const role = user.businessUserConfigs[0].role;
      const workTimePerDay = user.businessUserConfigs[0].workTimePerDay;
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        workTimePerDay,
        role: {
          id: role.id,
          name: role.name,
          projectPermissions: role.projectPermissions,
          businessPermissions: role.businessPermissions,
        },
      } as UserDto;
    });
  }

  async setUsers(projectId: number, userIds: number[] = []): Promise<void> {
    const project = await this.findById(projectId);
    project.user = await Promise.all(
      userIds.map((u) => this.userService.findById(u)),
    );
    await this.projectRepository.save(project);
  }

  async getOverview(projectId: number): Promise<ProjectDTO> {
    const project = await this.findById(projectId);
    return {
      id: project.id,
      name: project.name,
      description: project.description,
      address: project.address,
    } as ProjectDTO;
  }
}
