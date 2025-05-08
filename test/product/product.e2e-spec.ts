import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { testDbConfig } from '../setup-e2e';
import { ResponseInterceptor } from '../../src/core/interceptors/response.interceptor';
import { HttpExceptionFilter } from '../../src/core/filters/http-exception.filter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, getConnectionToken } from '@nestjs/typeorm';
import { ProductModule } from '../../src/modules/product/product.module';
import { UserModule } from '../../src/modules/user/user.module';
import { AuthModule } from '../../src/modules/auth/auth.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ClientsModule, Transport } from '@nestjs/microservices';

jest.setTimeout(60000);

describe('ProductController (e2e)', () => {
  let app: INestApplication;
  let jwtToken: string;
  let createdProductId: string;

  beforeAll(async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (!testDbConfig) {
      throw new Error(
        'Test database configuration is not available. Make sure setup-e2e.ts is properly configured.',
      );
    }

    console.log('Using test database config:', testDbConfig.url);

    const mockConfigService = {
      get: jest.fn((key) => {
        if (key === 'RABBITMQ_URL') return 'amqp://localhost:5672';
        if (key === 'RABBITMQ_PRODUCT_QUEUE') return 'product_queue';
        if (key === 'JWT_SECRET') return 'test-secret';
        if (key === 'JWT_EXPIRES_IN') return '1h';
        if (key === 'REDIS_HOST') return 'localhost';
        if (key === 'REDIS_PORT') return 6379;
        if (key === 'REDIS_TTL') return 60;
        return process.env[key];
      }),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        CacheModule.register({
          isGlobal: true,
          ttl: 60,
        }),
        TypeOrmModule.forRootAsync({
          useFactory: () => ({
            type: 'postgres',
            host: testDbConfig.host,
            port: testDbConfig.port,
            username: testDbConfig.username,
            password: testDbConfig.password,
            database: testDbConfig.database,
            entities: ['src/**/*.entity{.ts,.js}'],
            synchronize: true,
            logging: false,
          }),
        }),

        ClientsModule.register([
          {
            name: 'PRODUCT_SERVICE',
            transport: Transport.TCP,
          },
        ]),
        AuthModule,
        UserModule,
        ProductModule,
      ],
    })
      .overrideProvider(ConfigService)
      .useValue(mockConfigService)
      .compile();

    app = moduleFixture.createNestApplication();

    app.setGlobalPrefix('api/v1');
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
    app.useGlobalInterceptors(new ResponseInterceptor());
    app.useGlobalFilters(new HttpExceptionFilter());

    await app.init();

    const testUser = {
      name: 'Product Test Admin',
      email: `admin-test${Date.now()}@example.com`,
      password: 'Password123!',
    };

    const registerResponse = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send(testUser);

    jwtToken = registerResponse.body.data.accessToken;

    const dataSource = moduleFixture.get(getConnectionToken());
    await dataSource.query(
      "UPDATE users SET roles = ARRAY['admin', 'user'] WHERE email = $1",
      [testUser.email]
    );

    const loginResponse = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    jwtToken = loginResponse.body.data.accessToken;
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('should create a new product', async () => {
    const newProduct = {
      name: 'Teclado Mecánico RGB',
      description: 'Teclado con switches Cherry MX y luces RGB.',
      price: 89.95,
      stock: 120,
      categories: ['Electronics', 'Computer Accessories', 'Keyboards'],
      isActive: true
    };


    const response = await request(app.getHttpServer())
      .post('/api/v1/products')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send(newProduct);

    console.log('Respuesta de creación de producto:', response.body);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('statusCode', 201);
    expect(response.body).toHaveProperty('timestamp');
    
    expect(response.body.data).toHaveProperty('id');
    createdProductId = response.body.data.id;
    expect(response.body.data).toHaveProperty('name', newProduct.name);
    expect(response.body.data).toHaveProperty('description', newProduct.description);
    expect(response.body.data).toHaveProperty('price', newProduct.price);
    expect(response.body.data).toHaveProperty('stock', newProduct.stock);
    expect(response.body.data).toHaveProperty('isActive', newProduct.isActive);
    expect(response.body.data).toHaveProperty('categories');
    expect(response.body.data.categories).toEqual(expect.arrayContaining(newProduct.categories));
    expect(response.body.data).toHaveProperty('createdAt');
    expect(response.body.data).toHaveProperty('updatedAt');
  });

}); 