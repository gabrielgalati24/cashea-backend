import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { testDbConfig } from '../setup-e2e';
import { ResponseInterceptor } from '../../src/core/interceptors/response.interceptor';
import { HttpExceptionFilter } from '../../src/core/filters/http-exception.filter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let jwtToken: string;

  jest.setTimeout(30000);

  beforeAll(async () => {
    if (!testDbConfig) {
      throw new Error(
        'Test database configuration is not available. Make sure setup-e2e.ts is properly configured.',
      );
    }

    console.log('Using test database config:', testDbConfig.url);

    const mockConfigService = {
      get: jest.fn((key) => {
        if (key === 'RABBITMQ_URL') return 'amqp://localhost:5672';
        if (key === 'RABBITMQ_USER_QUEUE') return 'user_queue';
        if (key === 'JWT_SECRET') return 'test-secret';
        if (key === 'JWT_EXPIRES_IN') return '1h';
        return process.env[key];
      }),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
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
        AppModule,
      ],
    })
      .overrideProvider(ConfigService)
      .useValue(mockConfigService)
      .compile();

    app = moduleFixture.createNestApplication();

    // Configurar la aplicación con las mismas configuraciones que el API Gateway
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
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('should register a new user', async () => {
    const testUser = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'Password123!',
    };

    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send(testUser)
      .expect(201);

    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('accessToken');
    expect(response.body.data).toHaveProperty('refreshToken');
    expect(response.body).toHaveProperty('statusCode', 201);
  });

  it('should not register a user with invalid data', async () => {
    const invalidUser = {
      name: 'Test User',
      email: 'invalid-email',
      password: '123',
    };

    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send(invalidUser)
      .expect(400);

    expect(response.body).toHaveProperty('message');
    expect(Array.isArray(response.body.message)).toBe(true);
  });

  it('should login with registered user and get JWT token', async () => {
    const testUser = {
      name: 'Login Test User',
      email: `login${Date.now()}@example.com`,
      password: 'Password123!',
    };

    await request(app.getHttpServer()).post('/api/v1/auth/register').send(testUser).expect(201);

    const loginResponse = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      })
      .expect(200);

    expect(loginResponse.body).toHaveProperty('data');
    expect(loginResponse.body.data).toHaveProperty('accessToken');
    expect(loginResponse.body.data).toHaveProperty('refreshToken');

    jwtToken = loginResponse.body.data.accessToken;
  });

  it('should refresh access token with valid refresh token', async () => {
    if (!jwtToken) {
      console.warn('No JWT token available, skipping refresh token test');
      return;
    }

    const testUser = {
      name: 'Refresh Test User',
      email: `refresh${Date.now()}@example.com`,
      password: 'Password123!',
    };

    await request(app.getHttpServer()).post('/api/v1/auth/register').send(testUser).expect(201);

    const loginResponse = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      })
      .expect(200);

    const refreshToken = loginResponse.body.data.refreshToken;

    const refreshResponse = await request(app.getHttpServer())
      .post('/api/v1/auth/refresh')
      .send({ refreshToken })
      .expect(200);

    expect(refreshResponse.body).toHaveProperty('data');
    expect(refreshResponse.body.data).toHaveProperty('accessToken');
    expect(refreshResponse.body.data).toHaveProperty('refreshToken');
  });
});
