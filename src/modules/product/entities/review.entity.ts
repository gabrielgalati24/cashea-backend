import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../core/interfaces/base-entity.interface';
import { Product } from './product.entity';

@Entity('reviews')
export class Review extends BaseEntity {
  @Column()
  title: string;

  @Column('text')
  comment: string;

  @Column('int')
  rating: number;

  @Column()
  userId: string;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column()
  productId: string;
}
