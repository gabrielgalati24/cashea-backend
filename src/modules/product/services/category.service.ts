import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryRepository } from '../repositories/category.repository';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { Category } from '../entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async findAll(options?: {
    page?: number;
    limit?: number;
  }): Promise<{ items: Category[]; meta: { total: number; page: number; limit: number } }> {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;

    const { items, total } = await this.categoryRepository.findAll({
      skip,
      take: limit,
    });

    return {
      items,
      meta: {
        total,
        page,
        limit,
      },
    };
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoryRepository.create(createCategoryDto);
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOne(id);
    if (!category) {
      throw new NotFoundException(`Categoría con ID "${id}" no encontrada`);
    }
    return category;
  }
}
