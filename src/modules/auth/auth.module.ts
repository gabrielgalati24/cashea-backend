import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { CqrsModule } from '@nestjs/cqrs';
import { LoginCommandHandler } from './commands/handlers/login.handler';
import { RegisterCommandHandler } from './commands/handlers/register.handler';
import { RefreshTokenCommandHandler } from './commands/handlers/refresh-token.handler';
import { ValidateUserQueryHandler } from './queries/handlers/validate-user.handler';

const commandHandlers = [LoginCommandHandler, RegisterCommandHandler, RefreshTokenCommandHandler];

const queryHandlers = [ValidateUserQueryHandler];

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION', '1d'),
        },
      }),
    }),
    CqrsModule,
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, ...commandHandlers, ...queryHandlers],
  exports: [AuthService],
})
export class AuthModule {}
