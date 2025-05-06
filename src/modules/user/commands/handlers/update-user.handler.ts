import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { UpdateUserCommand } from '../implementations/update-user.command';
import { UserRepository } from '../../repositories/user.repository';

@CommandHandler(UpdateUserCommand)
export class UpdateUserCommandHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(command: UpdateUserCommand) {
    const { id, updateUserDto } = command;

    const updatedUser = await this.userRepository.update(id, updateUserDto);

    if (!updatedUser) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    return updatedUser;
  }
}
