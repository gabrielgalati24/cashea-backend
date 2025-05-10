import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto } from '../dto/create-category.dto';

@Injectable()
export class CategoryRepository {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async findAll(options?: {
    skip?: number;
    take?: number;
  }): Promise<{ items: Category[]; total: number }> {
    const [items, total] = await this.categoryRepository.findAndCount({
      skip: options?.skip,
      take: options?.take,
      order: { name: 'ASC' },
    });

    return { items, total };
  }

  async findOne(id: string): Promise<Category | null> {
    return this.categoryRepository.findOne({ where: { id } });
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(category);
  }
}
