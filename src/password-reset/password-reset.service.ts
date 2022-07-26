import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { UpdatePasswordResetDto } from './dto/update-password-reset.dto';
import { PasswordReset } from './entities/password-reset.entity';

@Injectable()
export class PasswordResetService {
  constructor(
    @InjectRepository(PasswordReset)
    private passwordResetRepository: Repository<PasswordReset>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  async create(email: string) {
    const [user] = await this.usersService.find(email);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    const code = String(Math.floor(Math.random() * 1000000)).padEnd(6, '0');
    const expireIn = new Date().getTime() + 60000 * 15;
    const pr = this.passwordResetRepository.create({
      id: user.id,
      email,
      code,
      expireIn,
    });
    this.passwordResetRepository.save(pr);
    const payload = { username: user.email, sub: user.id, code };
    const token = this.jwtService.sign(payload);
    const link = `http://localhost:3000/auth/?reset-token=${token}`;
    const sendMailOptions: ISendMailOptions = {
      to: email,
      from: process.env.SEND_MAIL_OPTIONS_FROM,
      subject: 'Testing nodemailer',
      html: `
      <p>Hi,</p>
      <p>Verify code is：<strong style="color:orangered;">${code}</strong></p>
      <p>Link:<a href=${link}>${link}</a></p>
      `,
    };
    this.mailerService.sendMail(sendMailOptions);

    return { reset_token: this.jwtService.sign(payload) };
  }

  findAll() {
    return `This action returns all passwordReset`;
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }
    return this.passwordResetRepository.findOne({ where: { id } });
  }

  update(id: number, updatePasswordResetDto: UpdatePasswordResetDto) {
    return `This action updates a #${id} passwordReset`;
  }

  remove(id: number) {
    return `This action removes a #${id} passwordReset`;
  }
}
