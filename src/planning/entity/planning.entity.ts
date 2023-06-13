import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entity/user.entity';
import { Project } from '../../project/entity/project.entity';

@Entity()
export class Planning {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @ManyToMany(() => User)
  @JoinTable()
  user: User[];

  @ManyToOne(() => Project)
  project: Project;
}
