import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { EmailModule } from './email/email.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { PasswordResetModule } from './password-reset/password-reset.module';
import { PasswordReset } from './password-reset/entities/password-reset.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, PasswordReset],
      synchronize: true,
    }),
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        auth: {
          user: process.env.MAILER_USER,
          pass: process.env.MAILER_PASS,
        },
      },
      template: {
        dir: process.cwd() + '/src/email/template',
        adapter: new EjsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    EmailModule,
    UsersModule,
    PasswordResetModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
