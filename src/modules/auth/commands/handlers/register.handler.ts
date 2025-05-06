import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConflictException, Injectable } from '@nestjs/common';
import { RegisterCommand } from '../implementations/register.command';
import { UserService } from '../../../user/services/user.service';
import { AuthService } from '../../services/auth.service';

@Injectable()
@CommandHandler(RegisterCommand)
export class RegisterCommandHandler implements ICommandHandler<RegisterCommand> {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  async execute(command: RegisterCommand) {
    const { email, password, name } = command.registerDto;

    // Check if user already exists
    const existingUser = await this.userService.findOneByEmail(email);

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const user = await this.userService.create({
      email,
      password,
      name,
      roles: ['user'],
    });

    // Generate tokens
    return this.authService.generateTokens(user.id, user.email, user.roles);
  }
}
