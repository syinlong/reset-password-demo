import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PasswordResetService } from 'src/password-reset/password-reset.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @Inject(forwardRef(() => PasswordResetService))
    private readonly passwordResetService: PasswordResetService,
  ) {}

  create(email: string, password: string) {
    const user = this.usersRepository.create({ email, password });

    return this.usersRepository.save(user);
  }

  findAll() {
    return this.usersRepository.find();
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }
    return this.usersRepository.findOne({ where: { id } });
  }

  find(email: string) {
    return this.usersRepository.find({ where: { email } });
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    Object.assign(user, attrs);
    return this.usersRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return this.usersRepository.remove(user);
  }

  async validate(userId: number, code: string) {
    const pr = await this.passwordResetService.findOne(userId);
    if (pr.activate) {
      throw new UnauthorizedException('link expired');
    }
    if (pr.expireIn < new Date().getTime()) {
      throw new UnauthorizedException('code expired');
    }
    if (pr.code !== code) {
      throw new UnauthorizedException('code not match');
    }
    return pr;
  }
}
