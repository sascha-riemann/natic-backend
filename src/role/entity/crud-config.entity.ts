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

@Entity()
export class CrudConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  read: boolean;

  @Column({ default: false })
  write: boolean;

  @Column({ default: false })
  delete: boolean;
}
