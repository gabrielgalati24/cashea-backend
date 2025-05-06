import { IRepository } from './repository.interface';

export interface ProductEntity {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  categories: string[];
  isActive: boolean;
}

export interface IProductRepository extends IRepository<ProductEntity, string> {
  /**
   * Finds products by category
   */
  findByCategory(
    category: string,
    options?: { skip?: number; take?: number },
  ): Promise<ProductEntity[]>;

  /**
   * Finds all products with pagination and filtering
   */
  findAll(options?: {
    skip?: number;
    take?: number;
    category?: string;
    search?: string;
  }): Promise<{ items: ProductEntity[]; total: number }>;

  /**
   * Creates multiple products in bulk
   */
  bulkCreate(products: Omit<ProductEntity, 'id'>[]): Promise<ProductEntity[]>;
}
