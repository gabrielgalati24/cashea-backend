import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from '../implementations/create-user.command';
import { UserRepository } from '../../repositories/user.repository';
import { ConflictException } from '@nestjs/common';

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler implements ICommandHandler<CreateUserCommand> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(command: CreateUserCommand) {
    const { email } = command.createUserDto;

    // Check if user with this email already exists
    const existingUser = await this.userRepository.findOneByEmail(email);

    if (existingUser) {
      throw new ConflictException(`User with email "${email}" already exists`);
    }

    return this.userRepository.create(command.createUserDto);
  }
}
