import { ICommand } from '@nestjs/cqrs';
import { RegisterDto } from '../../dto/register.dto';

export class RegisterCommand implements ICommand {
  constructor(public readonly registerDto: RegisterDto) {}
}
