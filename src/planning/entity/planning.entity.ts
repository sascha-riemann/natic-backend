import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entity/user.entity';
import { Project } from '../../project/entity/project.entity';
import { Resource } from '../../resources/ressources/resource';
import { Business } from '../../business/entity/business.entity';

@Entity()
export class Planning {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @ManyToMany(() => User)
  @JoinTable({ name: 'planning_users' })
  user: User[];

  @ManyToMany(() => Resource)
  @JoinTable({ name: 'planning_resources' })
  resources: Resource[];

  @ManyToOne(() => Project)
  project: Project;

  @Column()
  created: Date;

  @ManyToOne(() => Business)
  business: Business;
}
