import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { ResponseInterceptor } from './core/interceptors/response.interceptor';
import { HttpExceptionFilter } from './core/filters/http-exception.filter';
import { GlobalExceptionFilter } from './core/exceptions/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  // Global prefix
  const apiPrefix = configService.get<string>('apiPrefix', 'api');
  const apiVersion = configService.get<string>('apiVersion', 'v1');
  app.setGlobalPrefix(`${apiPrefix}/${apiVersion}`);

  // Security
  app.use(helmet());
  app.enableCors();

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global interceptors & filters
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new GlobalExceptionFilter(), new HttpExceptionFilter());

  // Swagger documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('NestJS Microservices API')
    .setDescription('API documentation for NestJS Microservices architecture')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(configService.get<string>('swaggerPath', 'docs'), app, document);

  // Start the server
  const port = configService.get<number>('port', 3000);
  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}`);
  logger.log(
    `Swagger documentation available at: http://localhost:${port}/${configService.get<string>(
      'swaggerPath',
      'docs',
    )}`,
  );
}
bootstrap();
