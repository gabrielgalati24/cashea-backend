import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UnauthorizedException } from '@nestjs/common';
import { RefreshTokenCommand } from '../implementations/refresh-token.command';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../../user/services/user.service';

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenCommandHandler implements ICommandHandler<RefreshTokenCommand> {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  async execute(command: RefreshTokenCommand) {
    const { refreshToken } = command.refreshTokenDto;

    // Verify the refresh token
    const payload = await this.authService.verifyRefreshToken(refreshToken);

    // Check if the user exists
    const user = await this.userService.findOneById(payload.sub);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Generate new tokens
    return this.authService.generateTokens(user.id, user.email, user.roles);
  }
}
