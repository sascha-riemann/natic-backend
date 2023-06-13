import { Injectable } from '@nestjs/common';

import { Between, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Planning } from '../entity/planning.entity';
import { ProjectService } from '../../project/service/project.service';
import { UsersService } from '../../users/service/users.service';

@Injectable()
export class PlanningService {
  constructor(
    @InjectRepository(Planning)
    private readonly planningRepository: Repository<Planning>,
    private readonly projectService: ProjectService,
    private readonly usersService: UsersService,
  ) {}

  async getPlannings(businessId: number, start: Date, end: Date) {
    const planned = await this.planningRepository.find({
      where: {
        date: Between(start, end),
      },
      relations: ['project', 'user'],
    });

    return planned.map((p) => ({
      id: p.id,
      date: p.date,
      project: {
        id: p.project.id,
        name: p.project.name,
      },
      user: p.user.map((s) => ({
        id: s.id,
        firstName: s.firstName,
        lastName: s.lastName,
      })),
    }));
  }

  async createPlanning(
    userId: number,
    date: Date,
    projectId: number,
  ): Promise<number | void> {
    const planning = await this.planningRepository.findOne({
      where: {
        date,
        project: {
          id: projectId,
        },
      },
    });

    if (!planning) {
      const newPlanning = new Planning();
      newPlanning.project = await this.projectService.findById(projectId);
      newPlanning.date = date;
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
      relations: ['user', 'project'],
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
}
