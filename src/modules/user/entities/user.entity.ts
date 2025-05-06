import { Column, Entity, Index } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '../../../core/interfaces/base-entity.interface';

@Entity('users')
export class User extends BaseEntity {
  @Column()
  name: string;

  @Index({ unique: true })
  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Column('text', { array: true, default: ['user'] })
  roles: string[];

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  lastLoginAt: Date;
}
