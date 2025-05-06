import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../../../core/decorators/public.decorator';
import { LoginCommand } from '../commands/implementations/login.command';
import { RefreshTokenCommand } from '../commands/implementations/refresh-token.command';
import { RegisterCommand } from '../commands/implementations/register.command';
import { LoginDto } from '../dto/login.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { RegisterDto } from '../dto/register.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User has been successfully registered',
  })
  async register(@Body() registerDto: RegisterDto) {
    return this.commandBus.execute(new RegisterCommand(registerDto));
  }

  @Public()
  @UseGuards(AuthGuard('local'))
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User has been successfully logged in',
  })
  async login(@Body() loginDto: LoginDto) {
    return this.commandBus.execute(new LoginCommand(loginDto));
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Access token has been successfully refreshed',
  })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.commandBus.execute(new RefreshTokenCommand(refreshTokenDto));
  }
}
