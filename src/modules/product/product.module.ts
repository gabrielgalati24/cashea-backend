import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { Product } from './entities/product.entity';
import { ProductRepository } from './repositories/product.repository';
import { ProductService } from './services/product.service';
import { ProductController } from './controllers/product.controller';

const queryHandlers: any[] = [];
const commandHandlers: any[] = [];

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
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
  controllers: [ProductController],
  providers: [ProductService, ProductRepository, ...queryHandlers, ...commandHandlers],
  exports: [ProductService],
})
export class ProductModule {}
