import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Project } from '../../project/entity/project.entity';
import { BusinessUserConfig } from '../../business/entity/business-user-config.entity';
import { Planning } from '../../planning/entity/planning.entity';
import { ProjectTaskEntity } from '../../project-task/entities/project-task.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  password: string;

  @OneToMany(() => BusinessUserConfig, (config) => config.user, {
    cascade: true,
  })
  businessUserConfigs: BusinessUserConfig[];

  @ManyToMany(() => Project, { cascade: ['remove'] })
  @JoinTable({ name: 'user_projects' })
  projects: Project[];

  @ManyToMany(() => Planning, { cascade: true })
  @JoinTable({ name: 'planning_users' })
  plannings: Planning[];

  @OneToMany(() => ProjectTaskEntity, (projectTask) => projectTask.creator)
  @JoinTable({ name: 'project_task_creator' })
  createdProjectTasks: ProjectTaskEntity[];

  @ManyToMany(() => ProjectTaskEntity)
  @JoinTable({ name: 'project_task_assigned' })
  assignedProjectTasks: ProjectTaskEntity[];
}
