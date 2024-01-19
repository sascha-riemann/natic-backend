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
import { User } from '../../users/entity/user.entity';
import { Business } from './business.entity';
import { RoleEntity } from '../../role/entity/role.entity';
import { BusinessPermissionsEntity } from '../../role/entity/business-permissions.entity';
import { ProjectPermissionEntity } from '../../role/entity/project-permissions.entity';

@Entity()
export class BusinessUserConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { cascade: ['insert'], onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @ManyToOne(() => Business, { onDelete: 'CASCADE' })
  @JoinColumn()
  business: Business;

  @Column({ nullable: true })
  workTimePerDay: number;

  @ManyToOne(() => RoleEntity)
  @JoinTable({ name: 'user_business_config_roles' })
  role: RoleEntity;

  @OneToOne(
    () => BusinessPermissionsEntity,
    (permission) => permission.businessUserConfig,
  )
  businessPermissions: BusinessPermissionsEntity;

  @OneToMany(
    () => ProjectPermissionEntity,
    (permission) => permission.businessUserConfig,
  )
  projectPermissions: ProjectPermissionEntity[];
}
