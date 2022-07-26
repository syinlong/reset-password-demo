import { Injectable } from '@nestjs/common';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { CreateEmailDto } from './dto/create-email.dto';
import { UpdateEmailDto } from './dto/update-email.dto';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  sendEmail(): void {
    const sendMailOptions: ISendMailOptions = {
      to: 'to@test.com',
      from: 'from@test.com',
      subject: 'Testing nodemailer',
      template: 'index.ejs',
      // text: 'welcome',
      // html: '<b>welcome<b>',
      context: {
        user: 'user',
        code: '0723',
      },
      // attachments: [
      //   {
      //     filename: '',
      //     path: '',
      //   },
      // ],
    };

    this.mailerService
      .sendMail(sendMailOptions)
      .then((success) => {
        console.log(success);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  create(createEmailDto: CreateEmailDto) {
    return 'This action adds a new email';
  }

  findAll() {
    return `This action returns all email`;
  }

  findOne(id: number) {
    return `This action returns a #${id} email`;
  }

  update(id: number, updateEmailDto: UpdateEmailDto) {
    return `This action updates a #${id} email`;
  }

  remove(id: number) {
    return `This action removes a #${id} email`;
  }
}
