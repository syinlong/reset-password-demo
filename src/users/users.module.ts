import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { AuthService } from './auth.service';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { JwtStrategy } from './jwt.strategy';
import { PasswordReset } from 'src/password-reset/entities/password-reset.entity';
import { PasswordResetService } from 'src/password-reset/password-reset.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, PasswordReset]),
    JwtModule.register({
      secret: process.env.RESET_PASSWORD_JWT_CONSTANT,
      signOptions: { expiresIn: '15m' },
    }),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    AuthService,
    PasswordResetService,
    JwtStrategy,
    {
      provide: APP_INTERCEPTOR,
      useClass: CurrentUserInterceptor,
    },
  ],
})
export class UsersModule {}
