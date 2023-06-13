import { Entity, ManyToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Project } from '../../project/entity/project.entity';
import { CrudConfig } from './crud-config.entity';

@Entity()
export class ProjectPermission {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Project)
  projects: Project[];

  @OneToOne(() => CrudConfig)
  overview: CrudConfig;
}
