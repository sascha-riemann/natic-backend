import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BusinessEntity } from '../../business/entity/business.entity';
import { User } from '../../users/entity/user.entity';
import { Project } from '../../project/entity/project.entity';
import { CrudConfig } from "./crud-config.entity";

@Entity()
export class OrganizationPermission {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => BusinessEntity)
  business: BusinessEntity;

  @OneToOne(() => CrudConfig)
  overview: CrudConfig;
}
