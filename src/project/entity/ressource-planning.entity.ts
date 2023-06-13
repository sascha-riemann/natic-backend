import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entity/user.entity';
import { ProjectPermission } from '../../role/entity/project-permission.entity';
import { Project } from './project.entity';
import { Projects } from '../dto/projects.dto';

@Entity()
export class RessourcePlanning {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  start: Date;

  @Column()
  end: Date;

  @ManyToOne(() => Project)
  project: Project;
}
