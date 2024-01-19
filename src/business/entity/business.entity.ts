import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Project } from '../../project/entity/project.entity';
import { ResourceCategory } from '../../resources/ressources/resource.category';
import { BusinessUserConfig } from './business-user-config.entity';

@Entity()
export class Business {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  address: string;

  @OneToMany(() => BusinessUserConfig, (config) => config.business, {
    cascade: true,
  })
  businessUserConfigs: BusinessUserConfig[];

  @ManyToMany(() => Project)
  projects: Project[];

  @OneToMany(() => ResourceCategory, (resource) => resource.business)
  resourceCategories: ResourceCategory[];
}
