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
}
