import { Injectable, NotFoundException } from '@nestjs/common';
import { ReviewRepository } from '../repositories/review.repository';
import { ProductService } from './product.service';
import { CreateReviewDto } from '../dto/create-review.dto';
import { Review } from '../entities/review.entity';

@Injectable()
export class ReviewService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly productService: ProductService,
  ) {}

  async findByProductId(
    productId: string,
    options?: { page?: number; limit?: number },
  ): Promise<{ items: Review[]; meta: { total: number; page: number; limit: number } }> {
    await this.productService.findOneById(productId);

    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;

    const { items, total } = await this.reviewRepository.findByProductId(productId, {
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

  async create(productId: string, createReviewDto: CreateReviewDto): Promise<Review> {
    await this.productService.findOneById(productId);

    return this.reviewRepository.create(productId, createReviewDto);
  }
}
