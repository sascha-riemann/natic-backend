import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BusinessEntity } from '../../business/entity/business.entity';
import { User } from '../../users/entity/user.entity';
import { ProjectPermission } from './project-permission.entity';

@Entity()
export class RoleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => User)
  user: User[];

  @ManyToOne(() => BusinessEntity, (business) => business.roles)
  business: BusinessEntity;

  @OneToOne(() => ProjectPermission)
  constructionPermission: ProjectPermission;

  // @OneToOne(() => OrganizationPermission)
  // organizationPermission: OrganizationPermission;
}
