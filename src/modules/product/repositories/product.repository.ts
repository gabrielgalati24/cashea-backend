import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findAll(options?: {
    skip?: number;
    take?: number;
    category?: string;
    search?: string;
  }): Promise<[Product[], number]> {
    const query = this.productRepository.createQueryBuilder('product');

    if (options?.category) {
      query.where(':category = ANY(product.categories)', {
        category: options.category,
      });
    }

    if (options?.search) {
      query.andWhere('(product.name ILIKE :search OR product.description ILIKE :search)', {
        search: `%${options.search}%`,
      });
    }

    query.orderBy('product.createdAt', 'DESC').skip(options?.skip).take(options?.take);

    return query.getManyAndCount();
  }

  async findOneById(id: string): Promise<Product | null> {
    return this.productRepository.findOneBy({ id });
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    return this.productRepository.save(product);
  }

  async bulkCreate(products: CreateProductDto[]): Promise<Product[]> {
    const createdProducts = this.productRepository.create(products);
    return this.productRepository.save(createdProducts);
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product | null> {
    const product = await this.findOneById(id);
    if (!product) {
      return null;
    }

    const updatedProduct = this.productRepository.merge(product, updateProductDto);
    return this.productRepository.save(updatedProduct);
  }

  async delete(id: string): Promise<void> {
    await this.productRepository.softDelete({ id });
  }

  async findByCategory(
    category: string,
    options?: { skip?: number; take?: number },
  ): Promise<[Product[], number]> {
    return this.productRepository.findAndCount({
      where: { categories: ILike(`%${category}%`) },
      skip: options?.skip,
      take: options?.take,
      order: { createdAt: 'DESC' },
    });
  }
}
