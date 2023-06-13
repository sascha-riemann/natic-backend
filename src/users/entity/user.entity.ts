import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BusinessEntity } from '../../business/entity/business.entity';
import { Project } from '../../project/entity/project.entity';
import { RoleEntity } from '../../role/entity/role.entity';
import { OrganizationPermission } from '../../role/entity/organization-permission.entity';
import { ProjectPermission } from '../../role/entity/project-permission.entity';

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
  address: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  password: string;

  @ManyToMany(() => BusinessEntity)
  @JoinTable()
  businesses: BusinessEntity[];

  @ManyToMany(() => Project)
  @JoinTable()
  constructionSites: Project[];

  @ManyToMany(() => RoleEntity)
  @JoinTable()
  roles: RoleEntity[];

  // @ManyToMany(() => ProjectPermission)
  // @JoinTable()
  // constructionPermissions: ProjectPermission[];

  // @ManyToMany(() => OrganizationPermission)
  // @JoinTable()
  // organizationPermissions: OrganizationPermission[];
}
