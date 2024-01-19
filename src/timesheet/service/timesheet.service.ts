import { ConflictException, Injectable } from '@nestjs/common';
import {
  Between,
  IsNull,
  LessThanOrEqual,
  MoreThanOrEqual,
  Not,
  Repository,
} from 'typeorm';
import { TimesheetEntry } from '../entity/timesheet-entry.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  TimesheetEntryDto,
  TimesheetEntryFormDto,
  Timesheet,
  TimesheetSegment,
} from '../dto/timesheet-entry.dto';
import { UsersService } from '../../users/service/users.service';
import { ProjectService } from '../../project/service/project.service';
import {
  differenceInHours,
  eachDayOfInterval,
  endOfDay,
  startOfDay,
} from 'date-fns';
import { TimesheetEntryCategory } from '../model/timesheet-entry-category';

@Injectable()
export class TimesheetService {
  constructor(
    @InjectRepository(TimesheetEntry)
    private readonly timesheetEntryRepository: Repository<TimesheetEntry>,
    private readonly userService: UsersService,
    private readonly projectService: ProjectService,
  ) {}

  async getTimesheetEntries(
    start: Date,
    end: Date,
    userId: number,
    businessId: number,
  ): Promise<Timesheet> {
    const days = eachDayOfInterval({
      start,
      end,
    });

    if (!userId) {
      // TODO: Error handling
      throw Error('no user provided');
    }

    const dayToEntries = await Promise.all(
      days.map((date) =>
        this.timesheetEntryRepository
          .find({
            where: {
              start: MoreThanOrEqual(startOfDay(date)),
              end: LessThanOrEqual(endOfDay(date)),
              user: {
                id: userId,
              },
            },
            relations: ['project', 'user'],
          })
          .then((entries) => ({
            date,
            entries,
          })),
      ),
    );

    const businessConfig = await this.userService.findBusinessConfig(
      userId,
      businessId,
    );

    const timesheetSegments = dayToEntries.map((dayToEntry) => {
      const date = dayToEntry.date;
      const fullDayCategory = dayToEntry.entries.find(
        (entry) => entry.fullWorkDay,
      )?.category;
      const entries = dayToEntry.entries
        .sort((a, b) => a.start.getTime() - b.start.getTime())
        .map(
          (entry) =>
            ({
              id: entry.id,
              start: entry.start,
              end: entry.end,
              category: entry.category,
              description: entry.description,
              fullWorkDay: entry.fullWorkDay,
              user: {
                id: entry.user.id,
                username: entry.user.username,
                firstName: entry.user.firstName,
                lastName: entry.user.lastName,
              },
              project: entry.project
                ? {
                    id: entry.project.id,
                    name: entry.project.name,
                  }
                : undefined,
            } as TimesheetEntryDto),
        );

      const workTime = fullDayCategory
        ? businessConfig.workTimePerDay
        : entries
            .filter((entry) => entry.category !== TimesheetEntryCategory.BREAK)
            .map((entry) => differenceInHours(entry.end, entry.start))
            .reduce((sum, current) => sum + current, 0);

      const breakTime = entries
        .filter((entry) => entry.category === TimesheetEntryCategory.BREAK)
        .map((entry) => differenceInHours(entry.end, entry.start))
        .reduce((sum, current) => sum + current, 0);

      return {
        date,
        entries,
        workTime,
        breakTime,
        fullDayCategory,
      } as TimesheetSegment;
    });

    return {
      timesheetSegments,
      workTimePerDay: businessConfig.workTimePerDay,
    };
  }

  async postTimesheetEntry(
    dto: TimesheetEntryFormDto,
    userId: number,
  ): Promise<void> {
    const timesheetEntry = await this.timesheetEntryRepository.find({
      where: {
        id: Not(dto.id),
        start: Between(new Date(dto.start), new Date(dto.end)),
        end: Between(new Date(dto.start), new Date(dto.end)),
        user: {
          id: userId,
        },
      },
    });

    if (timesheetEntry?.length) {
      throw new ConflictException('timerange');
    }

    const user = await this.userService.findById(userId);

    const project = await this.projectService.findById(dto.projectId);

    let entry: TimesheetEntry;
    if (dto.id) {
      entry =
        (await this.timesheetEntryRepository.findOneBy({ id: dto.id })) ||
        new TimesheetEntry();
    } else {
      entry = new TimesheetEntry();
    }
    entry.start = dto.start;
    entry.end = dto.end;
    entry.category = dto.category;
    entry.user = user;
    entry.project = project;
    entry.fullWorkDay = dto.fullWorkDay || false;
    entry.description = dto.description;

    void this.timesheetEntryRepository.save(entry);
  }

  deleteTimesheetEntry(id: number, userId: number) {
    void this.timesheetEntryRepository
      .createQueryBuilder('timesheetEntry')
      .delete()
      .from(TimesheetEntry)
      .where('id = :id', { id: id })
      .andWhere('user.id = :userId', { userId: userId })
      .execute();
  }
}
