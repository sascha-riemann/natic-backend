import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Project } from '../entity/project.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '../../users/service/users.service';
import { Projects } from '../dto/projects.dto';
import { ProjectOverview } from '../dto/project-overview';
import { ProjectStaffOverviewDto } from '../dto/project-staff.dto';
import { ProjectCreateDto } from '../dto/project-create.dto';
import { ProjectScheduleDto } from '../dto/project-schedule.dto';
import { Schedule } from '../entity/schedule.entity';
import { BusinessService } from '../../business/service/business.service';
import { use } from 'passport';

@Injectable()
export class ProjectService {
  constructor(
    private readonly userService: UsersService,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
    private readonly businessService: BusinessService,
  ) {}

  async create(
    userId: number,
    dto: ProjectCreateDto,
    businessId: number,
  ): Promise<number> {
    // TODO: Add default roles to organisation
    // TODO: Add admin role to user that created org
    const user = await this.userService.findById(userId);
    const business = await this.businessService.findById(businessId);

    // TODO: Check if already exists
    return this.projectRepository
      .save({
        name: dto.name,
        address: dto.address,
        description: dto.description,
        user: [user],
        business,
      })
      .then((r) => r.id);
  }

  findById(id: number): Promise<Project> {
    return this.projectRepository.findOne({ where: { id } });
  }

  async update(
    userId: number,
    dto: ProjectCreateDto,
    projectId: number,
  ): Promise<void> {
    const project = await this.projectRepository.findOneBy({ id: projectId });
    project.name = dto.name;
    project.address = dto.address;
    project.description = dto.description;
    void this.projectRepository.save(project);
  }

  async createSchedule(
    userId: number,
    dto: ProjectScheduleDto,
    projectId: number,
  ): Promise<void> {
    const project = await this.projectRepository.findOneBy({ id: projectId });
    const schedule = new Schedule();
    schedule.name = dto.name;
    schedule.description = dto.description;
    schedule.start = dto.start;
    schedule.end = dto.end;
    schedule.project = project;
    void this.scheduleRepository.save(schedule);
  }

  async getSchedules(projectId: number): Promise<Schedule[]> {
    // TODO: In DTO verpacken
    const project = await this.projectRepository.findOne({
      where: {
        id: projectId,
      },
      relations: ['schedules'],
    });
    return project.schedules;
  }

  async getList(userId: number, businessId): Promise<Projects> {
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
    return projects.map((project: Project) => ({
      id: project.id,
      name: project.name,
      description: project.description,
    })) as Projects;
  }

  async getStaffOverview(
    constructionSiteId: number,
  ): Promise<ProjectStaffOverviewDto> {
    const constructionSite = await this.getConstructionSite(constructionSiteId);
    return {
      user: constructionSite.user?.map((user) => ({
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        role: 'ROLE',
      })),
    };
  }

  async getConstructionSite(id: number): Promise<Project> {
    return await this.projectRepository.findOneBy({ id });
  }

  async getOverview(
    userId: number,
    constructionSiteId: number,
  ): Promise<ProjectOverview> {
    const constructionSite = await this.getConstructionSite(constructionSiteId);
    return {
      id: constructionSite.id,
      name: constructionSite.name,
      description: constructionSite.description,
      address: constructionSite.address,
    } as ProjectOverview;
  }
}
