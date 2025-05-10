import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../core/interfaces/base-entity.interface';

@Entity('categories')
export class Category extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: true })
  isActive: boolean;
}
