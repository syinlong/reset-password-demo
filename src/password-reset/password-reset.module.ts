import { Module } from '@nestjs/common';
import { PasswordResetService } from './password-reset.service';
import { PasswordResetController } from './password-reset.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordReset } from './entities/password-reset.entity';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PasswordReset, User]),
    JwtModule.register({
      secret: process.env.RESET_PASSWORD_JWT_CONSTANT,
      signOptions: { expiresIn: '15m' },
    }),
  ],
  controllers: [PasswordResetController],
  providers: [PasswordResetService, UsersService],
})
export class PasswordResetModule {}
