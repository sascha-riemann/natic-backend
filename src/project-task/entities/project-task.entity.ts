import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entity/user.entity';
import { Planning } from '../../planning/entity/planning.entity';
import { Project } from '../../project/entity/project.entity';

@Entity()
export class ProjectTaskEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  deadline: Date;

  @Column()
  created: Date;

  @ManyToOne(() => Project)
  project: Project;

  @ManyToOne(() => User)
  @JoinTable({ name: 'project_task_creator' })
  creator: User;

  @ManyToMany(() => Planning)
  @JoinTable({ name: 'project_task_assigned' })
  assigned: User[];
}
