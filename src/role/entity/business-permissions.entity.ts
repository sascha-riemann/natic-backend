import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { RoleEntity } from './role.entity';
import { BusinessUserConfig } from '../../business/entity/business-user-config.entity';

@Entity()
export class BusinessPermissionsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => BusinessUserConfig)
  businessUserConfig: BusinessUserConfig;

  @OneToOne(() => RoleEntity, (r) => r.businessPermissions)
  role: RoleEntity;

  @Column()
  createProjects: boolean;
}
