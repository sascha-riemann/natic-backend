import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Project } from '../../project/entity/project.entity';
import { TimesheetEntryCategory } from '../model/timesheet-entry-category';
import { User } from '../../users/entity/user.entity';

@Entity('timesheetEntry')
export class TimesheetEntry {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  category: TimesheetEntryCategory;

  @Column({ nullable: true })
  description: string;

  @Column()
  fullWorkDay: boolean;

  @Column()
  start: Date;

  @Column()
  end: Date;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Project)
  project: Project;
}
