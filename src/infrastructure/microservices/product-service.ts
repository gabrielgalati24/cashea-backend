import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { ProductModule } from '../../modules/product/product.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(ProductModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Product Microservice');

  const microservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('RABBITMQ_URL')].filter(Boolean) as string[],
      queue: configService.get<string>('RABBITMQ_PRODUCT_QUEUE'),
      queueOptions: {
        durable: true,
      },
    },
  });

  await app.startAllMicroservices();
  logger.log(`Product microservice is running`);
}
bootstrap();
