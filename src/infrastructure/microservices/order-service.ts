import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { OrderModule } from '../../modules/order/order.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(OrderModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Order Microservice');

  const microservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('RABBITMQ_URL')].filter(Boolean) as string[],
      queue: configService.get<string>('RABBITMQ_ORDER_QUEUE'),
      queueOptions: {
        durable: true,
      },
    },
  });

  await app.startAllMicroservices();
  logger.log(`Order microservice is running`);
}
bootstrap();
