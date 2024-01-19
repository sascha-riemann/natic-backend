import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RoleEntity } from './role.entity';
import { BusinessUserConfig } from '../../business/entity/business-user-config.entity';
import { Project } from '../../project/entity/project.entity';

@Entity()
export class ProjectPermissionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => BusinessUserConfig, { nullable: true })
  businessUserConfig: BusinessUserConfig;

  @OneToOne(() => RoleEntity, (r) => r.projectPermissions)
  role: RoleEntity;

  @OneToMany(() => Project, (project) => project.projectPermissions, {
    nullable: true,
  })
  projects: Project[];

  @Column()
  updateInformation: boolean;
}
