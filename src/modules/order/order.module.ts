import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { Order } from './entities/order.entity';
import { OrderRepository } from './repositories/order.repository';
import { OrderService } from './services/order.service';
import { OrderController } from './controllers/order.controller';
import { UserModule } from '../user/user.module';
import { ProductModule } from '../product/product.module';

import { GetOrdersQueryHandler } from './queries/handlers/get-orders.handler';
import { GetOrderByIdQueryHandler } from './queries/handlers/get-order-by-id.handler';
import { GetUserOrdersQueryHandler } from './queries/handlers/get-user-orders.handler';

const queryHandlers: any[] = [
  GetOrdersQueryHandler,
  GetOrderByIdQueryHandler,
  GetUserOrdersQueryHandler,
];

const commandHandlers: any[] = [
  // Handlers eliminados porque no existen los archivos
];

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    CqrsModule,
    ClientsModule.registerAsync([
      {
        name: 'ORDER_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URL')].filter(Boolean) as string[],
            queue: configService.get<string>('RABBITMQ_ORDER_QUEUE'),
            queueOptions: {
              durable: true,
            },
          },
        }),
      },
      {
        name: 'EVENT_BUS',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URL')].filter(Boolean) as string[],
            queue: configService.get<string>('RABBITMQ_ORDER_QUEUE'),
            queueOptions: {
              durable: true,
            },
          },
        }),
      },
    ]),
    UserModule,
    ProductModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository, ...queryHandlers, ...commandHandlers],
  exports: [OrderService],
})
export class OrderModule {}
