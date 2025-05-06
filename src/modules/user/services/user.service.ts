import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UserRepository } from '../repositories/user.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';
import { GetUsersQuery } from '../queries/implementations/get-users.query';
import { GetUserByIdQuery } from '../queries/implementations/get-user-by-id.query';
import { CreateUserCommand } from '../commands/implementations/create-user.command';
import { UpdateUserCommand } from '../commands/implementations/update-user.command';
import { DeleteUserCommand } from '../commands/implementations/delete-user.command';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
  ) {}

  async findAll(options?: { page?: number; limit?: number }) {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;

    return this.queryBus.execute(new GetUsersQuery(skip, limit));
  }

  async findOneById(id: string): Promise<User> {
    const user = await this.queryBus.execute(new GetUserByIdQuery(id));

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    return user;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneByEmail(email);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.commandBus.execute(new CreateUserCommand(createUserDto));

    // Emit user created event
    this.userClient.emit('user.created', user);

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.commandBus.execute(new UpdateUserCommand(id, updateUserDto));

    // Emit user updated event
    this.userClient.emit('user.updated', user);

    return user;
  }

  async delete(id: string): Promise<void> {
    await this.commandBus.execute(new DeleteUserCommand(id));

    // Emit user deleted event
    this.userClient.emit('user.deleted', { id });
  }
}
