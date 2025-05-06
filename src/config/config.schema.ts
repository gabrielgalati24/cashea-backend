import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  // Application
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().default(3000),

  // API
  API_PREFIX: Joi.string().default('api'),
  API_VERSION: Joi.string().default('v1'),
  SWAGGER_PATH: Joi.string().default('docs'),
  RATE_LIMIT_TTL: Joi.number().default(60),
  RATE_LIMIT_MAX: Joi.number().default(100),

  // JWT
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRATION: Joi.string().default('1d'),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_REFRESH_EXPIRATION: Joi.string().default('7d'),

  // Database
  DB_HOST: Joi.string().default('localhost'),
  DB_PORT: Joi.number().default(5432),
  DB_USERNAME: Joi.string().default('postgres'),
  DB_PASSWORD: Joi.string().default('postgres'),
  DB_DATABASE: Joi.string().default('nestjs_microservices'),

  // RabbitMQ
  RABBITMQ_URL: Joi.string().default('amqp://localhost:5672'),
  RABBITMQ_QUEUE_NAME: Joi.string().default('nestjs_queue'),
  RABBITMQ_USER_QUEUE: Joi.string().default('user_queue'),
  RABBITMQ_PRODUCT_QUEUE: Joi.string().default('product_queue'),
  RABBITMQ_ORDER_QUEUE: Joi.string().default('order_queue'),

  // Redis
  REDIS_HOST: Joi.string().default('localhost'),
  REDIS_PORT: Joi.number().default(6379),
  REDIS_TTL: Joi.number().default(60),

  // Logging
  LOG_LEVEL: Joi.string().valid('fatal', 'error', 'warn', 'info', 'debug', 'trace').default('info'),
});
