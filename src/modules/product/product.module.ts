import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { Product } from './entities/product.entity';
import { Category } from './entities/category.entity';
import { Review } from './entities/review.entity';

import { ProductRepository } from './repositories/product.repository';
import { CategoryRepository } from './repositories/category.repository';
import { ReviewRepository } from './repositories/review.repository';

import { ProductService } from './services/product.service';
import { CategoryService } from './services/category.service';
import { ReviewService } from './services/review.service';

import { ProductController } from './controllers/product.controller';
import { CategoryController } from './controllers/category.controller';
import { ReviewController } from './controllers/review.controller';

const queryHandlers: any[] = [];
const commandHandlers: any[] = [];

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category, Review]),
    CqrsModule,
    ClientsModule.registerAsync([
      {
        name: 'PRODUCT_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URL')].filter(Boolean) as string[],
            queue: configService.get<string>('RABBITMQ_PRODUCT_QUEUE'),
            queueOptions: {
              durable: true,
            },
          },
        }),
      },
    ]),
  ],
  controllers: [ProductController, CategoryController, ReviewController],
  providers: [
    ProductService,
    CategoryService,
    ReviewService,
    ProductRepository,
    CategoryRepository,
    ReviewRepository,
    ...queryHandlers,
    ...commandHandlers,
  ],
  exports: [ProductService, CategoryService, ReviewService],
})
export class ProductModule {}
