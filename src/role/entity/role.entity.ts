import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Business } from '../../business/entity/business.entity';
import { BusinessPermissionsEntity } from './business-permissions.entity';
import { ProjectPermissionEntity } from './project-permissions.entity';
import { BusinessUserConfig } from '../../business/entity/business-user-config.entity';

@Entity()
export class RoleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Business)
  business: Business;

  @OneToMany(() => BusinessUserConfig, (c) => c.role)
  @JoinTable({ name: 'user_business_config_roles' })
  businessUserConfigs: BusinessUserConfig[];

  @OneToOne(() => BusinessPermissionsEntity, (p) => p.role, {
    cascade: true,
    nullable: true,
  })
  @JoinColumn()
  businessPermissions: BusinessPermissionsEntity;

  @OneToOne(() => ProjectPermissionEntity, (p) => p.role, {
    cascade: true,
    nullable: true,
  })
  @JoinColumn()
  projectPermissions: ProjectPermissionEntity;
}
