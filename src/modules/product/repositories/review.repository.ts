import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../entities/review.entity';
import { CreateReviewDto } from '../dto/create-review.dto';

@Injectable()
export class ReviewRepository {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
  ) {}

  async findByProductId(
    productId: string,
    options?: { skip?: number; take?: number },
  ): Promise<{ items: Review[]; total: number }> {
    const [items, total] = await this.reviewRepository.findAndCount({
      where: { productId },
      skip: options?.skip,
      take: options?.take,
      order: { createdAt: 'DESC' },
    });

    return { items, total };
  }

  async create(productId: string, createReviewDto: CreateReviewDto): Promise<Review> {
    const review = this.reviewRepository.create({
      ...createReviewDto,
      productId,
    });
    return this.reviewRepository.save(review);
  }
}
