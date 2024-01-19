import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Business } from '../../business/entity/business.entity';
import { Resource } from './resource';

@Entity()
export class ResourceCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Business)
  business: Business;

  @OneToMany(() => Resource, (resource) => resource.resourceCategory, {
    cascade: true,
  })
  resources: Resource[];
}
