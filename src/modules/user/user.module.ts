import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { UserRepository } from './repositories/user.repository';
import { User } from './entities/user.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { GetUsersQueryHandler } from './queries/handlers/get-users.handler';
import { GetUserByIdQueryHandler } from './queries/handlers/get-user-by-id.handler';
import { CreateUserCommandHandler } from './commands/handlers/create-user.handler';
import { UpdateUserCommandHandler } from './commands/handlers/update-user.handler';
import { DeleteUserCommandHandler } from './commands/handlers/delete-user.handler';

const queryHandlers = [GetUsersQueryHandler, GetUserByIdQueryHandler];

const commandHandlers = [
  CreateUserCommandHandler,
  UpdateUserCommandHandler,
  DeleteUserCommandHandler,
];

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    CqrsModule,
    ClientsModule.registerAsync([
      {
        name: 'USER_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URL')].filter(Boolean) as string[],
            queue: configService.get<string>('RABBITMQ_USER_QUEUE'),
            queueOptions: {
              durable: true,
            },
          },
        }),
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository, ...queryHandlers, ...commandHandlers],
  exports: [UserService],
})
export class UserModule {}
