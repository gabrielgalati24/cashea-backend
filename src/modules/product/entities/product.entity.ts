import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../../core/interfaces/base-entity.interface';

@Entity('products')
export class Product extends BaseEntity {
  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ default: 0 })
  stock: number;

  @Column({ default: true })
  isActive: boolean;

  @Index()
  @Column('text', { array: true, default: [] })
  categories: string[];
}
