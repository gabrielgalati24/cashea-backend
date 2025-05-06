import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { DeleteUserCommand } from '../implementations/delete-user.command';
import { UserRepository } from '../../repositories/user.repository';

@CommandHandler(DeleteUserCommand)
export class DeleteUserCommandHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(command: DeleteUserCommand) {
    const { id } = command;

    const user = await this.userRepository.findOneById(id);

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    await this.userRepository.delete(id);
  }
}
