import { GenericContainer } from 'testcontainers';
import { Client } from 'pg';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DynamicModule } from '@nestjs/common';

export let postgresContainer: any;
export let postgresClient: Client;
export let testDbConfig: any;

const initializeTestContainer = async () => {
  jest.setTimeout(120000);

  postgresContainer = await new GenericContainer('postgres:15')
    .withExposedPorts(5432)
    .withEnvironment({
      POSTGRES_USER: 'postgres',
      POSTGRES_PASSWORD: 'postgres',
      POSTGRES_DB: 'testdb',
    })
    .start();

  const host = postgresContainer.getHost();
  const port = postgresContainer.getMappedPort(5432);
  const username = 'postgres';
  const password = 'postgres';
  const database = 'testdb';

  postgresClient = new Client({
    host,
    port,
    database,
    user: username,
    password,
  });

  await postgresClient.connect();

  testDbConfig = {
    host,
    port,
    database,
    username,
    password,
    url: `postgresql://${username}:${password}@${host}:${port}/${database}`,
  };

  console.log('Contenedor de PostgreSQL iniciado:', testDbConfig.url);
  console.log('Conectado a la base de datos de prueba...');

  return { postgresContainer, postgresClient, testDbConfig };
};

const containerPromise = initializeTestContainer();

beforeAll(async () => {
  await containerPromise;
});

afterAll(async () => {
  if (postgresClient) {
    await postgresClient.end();
  }

  if (postgresContainer) {
    await postgresContainer.stop();
  }
  console.log('Base de datos de prueba detenida...');
});

export const getTestTypeOrmModule = (): DynamicModule => {
  return TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: () => ({
      type: 'postgres',
      host: testDbConfig.host,
      port: testDbConfig.port,
      username: testDbConfig.username,
      password: testDbConfig.password,
      database: testDbConfig.database,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: false,
    }),
  });
};
