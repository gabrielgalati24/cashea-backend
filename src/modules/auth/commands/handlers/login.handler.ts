import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UnauthorizedException } from '@nestjs/common';
import { LoginCommand } from '../implementations/login.command';
import { AuthService } from '../../services/auth.service';

@CommandHandler(LoginCommand)
export class LoginCommandHandler implements ICommandHandler<LoginCommand> {
  constructor(private readonly authService: AuthService) {}

  async execute(command: LoginCommand) {
    const { email, password } = command.loginDto;
    const user = await this.authService.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.authService.generateTokens(user.id, user.email, user.roles);
  }
}
