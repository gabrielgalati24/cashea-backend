import { Injectable, NotFoundException } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { ProductRepository } from '../repositories/product.repository';
import { Product } from '../entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async findAll(options?: { page?: number; limit?: number; category?: string; search?: string }) {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;

    return this.productRepository.findAll({
      skip,
      take: limit,
      category: options?.category,
      search: options?.search,
    });
  }

  async findOneById(id: string): Promise<Product> {
    const product = await this.productRepository.findOneById(id);
    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
    return product;
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    return this.productRepository.create(createProductDto);
  }

  async bulkCreate(products: CreateProductDto[]): Promise<Product[]> {
    return this.productRepository.bulkCreate(products);
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.productRepository.update(id, updateProductDto);
    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
    return product;
  }

  async delete(id: string): Promise<void> {
    const product = await this.findOneById(id);
    await this.productRepository.delete(id);
  }

  async findByCategory(category: string, options?: { page?: number; limit?: number }) {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;

    return this.productRepository.findByCategory(category, { skip, take: limit });
  }

  async getProductStats(): Promise<{
    totalProducts: number;
    activeProducts: number;
    lowStockProducts: number;
    categoriesCount: Record<string, number>;
  }> {
    const [products, total] = await this.productRepository.findAll({
      skip: 0,
      take: 1000,
    });

    const categoriesMap: Record<string, number> = {};
    let activeCount = 0;
    let lowStockCount = 0;

    products.forEach((product: Product) => {
      if (product.isActive) {
        activeCount++;
      }

      if (product.stock < 5) {
        lowStockCount++;
      }

      product.categories.forEach((category: string) => {
        if (!categoriesMap[category]) {
          categoriesMap[category] = 0;
        }
        categoriesMap[category]++;
      });
    });

    return {
      totalProducts: total,
      activeProducts: activeCount,
      lowStockProducts: lowStockCount,
      categoriesCount: categoriesMap,
    };
  }
}
