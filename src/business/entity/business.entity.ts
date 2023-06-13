import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RoleEntity } from '../../role/entity/role.entity';
import { User } from '../../users/entity/user.entity';
import { Project } from '../../project/entity/project.entity';

@Entity()
export class BusinessEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  address: string;

  @OneToMany(() => RoleEntity, (role) => role.business)
  roles: RoleEntity[];

  @ManyToMany(() => User)
  @JoinTable()
  user: User[];

  @ManyToMany(() => User)
  @JoinTable()
  projects: Project[];
}
