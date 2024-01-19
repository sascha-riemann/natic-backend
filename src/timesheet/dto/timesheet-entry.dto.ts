import { TimesheetEntryCategory } from '../model/timesheet-entry-category';

export interface TimesheetEntryFormDto {
  id?: number;
  category: TimesheetEntryCategory;
  description?: string;
  fullWorkDay: boolean;
  start?: Date;
  end?: Date;
  userId?: number;
  projectId?: number;
}

export interface TimesheetEntryDto {
  id?: number;
  category: TimesheetEntryCategory;
  description?: string;
  fullWorkDay: boolean;
  start?: Date;
  end?: Date;
  user: {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
  };
  project?: {
    id: number;
    name: string;
  };
}

export interface TimesheetSegment {
  date: Date;
  entries: TimesheetEntryDto[];
  fullDayCategory?: TimesheetEntryCategory;
  workTime: number;
  breakTime: number;
}

export interface Timesheet {
  timesheetSegments: TimesheetSegment[];
  workTimePerDay?: number;
}
