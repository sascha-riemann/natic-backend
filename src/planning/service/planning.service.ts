import { Injectable } from '@nestjs/common';

import { Between, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Planning } from '../entity/planning.entity';
import { ProjectService } from '../../project/service/project.service';
import { UsersService } from '../../users/service/users.service';
import { PlanningDto } from '../dto/planning.dto';
import { ResourceDTO } from '../../resources/dto/resource.dto';
import { BusinessService } from '../../business/service/business.service';
import { ResourcesService } from '../../resources/service/resources.service';

@Injectable()
export class PlanningService {
  constructor(
    @InjectRepository(Planning)
    private readonly planningRepository: Repository<Planning>,
    private readonly projectService: ProjectService,
    private readonly usersService: UsersService,
    private readonly businessService: BusinessService,
    private readonly resourcesService: ResourcesService,
  ) {}

  async getPlannings(
    businessId: number,
    start: Date,
    end: Date,
  ): Promise<PlanningDto[]> {
    const planned = await this.planningRepository.find({
      where: {
        date: Between(start, end),
        business: {
          id: businessId,
        },
      },
      relations: ['project', 'user', 'resources', 'resources.resourceCategory'],
    });

    const resourceCategories =
      await this.businessService.getBusinessResourceCategories(businessId);

    return planned
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .map((p) => ({
        id: p.id,
        date: p.date,
        project: {
          id: p.project.id,
          name: p.project.name,
          created: p.project.created,
        },
        users: p.user.map((s) => ({
          id: s.id,
          firstName: s.firstName,
          lastName: s.lastName,
        })),
        resources: resourceCategories.map((category) => ({
          category,
          resources: p.resources
            .filter((res) => res.resourceCategory.id === category.id)
            .map((res) => ({
              id: res.id,
              name: res.name,
              identification: res.identification,
              category,
            })),
        })),
        created: p.created,
      }));
  }

  async createPlanning(
    userId: number,
    date: Date,
    projectId: number,
    businessId: number,
  ): Promise<number | void> {
    const planning = await this.planningRepository.findOne({
      where: {
        date,
        project: {
          id: projectId,
        },
      },
    });

    const business = await this.businessService.findById(businessId);

    if (!planning) {
      const newPlanning = new Planning();
      newPlanning.project = await this.projectService.findById(projectId);
      newPlanning.date = date;
      newPlanning.created = new Date();
      newPlanning.business = business;
      const createdPlanning = await this.planningRepository.save(newPlanning);
      return createdPlanning.id;
    }
  }

  async deletePlanning(planningId: number): Promise<void> {
    await this.planningRepository.delete({ id: planningId });
  }

  private findById(id: number): Promise<Planning> {
    return this.planningRepository.findOne({
      where: { id },
      relations: ['user', 'project', 'resources'],
    });
  }

  async addUser(planningId: number, userId: number): Promise<void> {
    const planning = await this.findById(planningId);

    if (!planning.user) {
      planning.user = [];
    }

    planning.user.push(await this.usersService.findById(userId));

    await this.planningRepository.save(planning);
  }

  async deletePlanningUser(planningId: number, userId: number): Promise<void> {
    const planning = await this.findById(planningId);
    const index = planning?.user?.findIndex((user) => user.id == userId);

    if (index >= 0) {
      planning.user.splice(index, 1);
      await this.planningRepository.save(planning);
    }
  }

  async addResource(planningId: number, resourceId: number): Promise<void> {
    const planning = await this.findById(planningId);

    if (!planning.resources) {
      planning.resources = [];
    }

    planning.resources.push(await this.resourcesService.findById(resourceId));

    await this.planningRepository.save(planning);
  }

  async deletePlanningResource(
    planningId: number,
    resourceId: number,
  ): Promise<void> {
    const planning = await this.findById(planningId);
    const index = planning?.resources?.findIndex(
      (resource) => resource.id == resourceId,
    );

    if (index >= 0) {
      planning.resources.splice(index, 1);
      await this.planningRepository.save(planning);
    }
  }
}
