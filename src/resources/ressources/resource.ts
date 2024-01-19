import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ResourceCategory } from './resource.category';
import { Business } from '../../business/entity/business.entity';

@Entity()
export class Resource {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => ResourceCategory, { onDelete: 'CASCADE' })
  resourceCategory: ResourceCategory;

  @ManyToOne(() => Business)
  business: Business;

  @Column({ unique: true })
  identification: string;
}
