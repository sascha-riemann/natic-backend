import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entity/user.entity';
import { Planning } from '../../planning/entity/planning.entity';
import { Business } from '../../business/entity/business.entity';
import { ProjectPermissionEntity } from '../../role/entity/project-permissions.entity';

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
  @JoinTable({ name: 'project_users' })
  user: User[];

  @OneToMany(() => Planning, (planning) => planning.project)
  planning: Planning[];

  @ManyToOne(() => Business)
  business: Business;

  @Column()
  created: Date;

  @ManyToOne(() => ProjectPermissionEntity)
  projectPermissions: ProjectPermissionEntity[];
}
