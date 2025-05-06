import { ICommand } from '@nestjs/cqrs';
import { RefreshTokenDto } from '../../dto/refresh-token.dto';

export class RefreshTokenCommand implements ICommand {
  constructor(public readonly refreshTokenDto: RefreshTokenDto) {}
}
