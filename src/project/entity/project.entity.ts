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
import { Schedule } from './schedule.entity';
import { Planning } from '../../planning/entity/planning.entity';
import { BusinessEntity } from '../../business/entity/business.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  address: string;

  @ManyToMany(() => User)
  @JoinTable()
  user: User[];

  @OneToMany(() => Schedule, (schedule: Schedule) => schedule.project)
  schedules: Schedule[];

  @OneToOne(() => ProjectPermission)
  permissions: ProjectPermission[];

  @OneToMany(() => Planning, (planning) => planning.project)
  planning: Planning[];

  @ManyToOne(() => BusinessEntity)
  business: BusinessEntity;

  // TODO: Relation to Business
}
