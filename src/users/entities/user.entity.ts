import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { PasswordReset } from 'src/password-reset/entities/password-reset.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToOne(() => PasswordReset, (passwordReset) => passwordReset.id)
  @JoinColumn()
  passwordReset: PasswordReset;
}
