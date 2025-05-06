import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { UserModule } from '../../modules/user/user.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(UserModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('User Microservice');

  const microservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('RABBITMQ_URL')].filter(Boolean) as string[],
      queue: configService.get<string>('RABBITMQ_USER_QUEUE'),
      queueOptions: {
        durable: true,
      },
    },
  });

  await app.startAllMicroservices();
  logger.log(`User microservice is running`);
}
bootstrap();
