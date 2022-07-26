import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class PasswordReset {
  @PrimaryColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  code: string;

  @Column({ type: 'bigint' })
  expireIn: number;

  @Column({ default: false })
  activate: boolean;

  @OneToOne(() => User, (user) => user.id)
  user: User;
}
