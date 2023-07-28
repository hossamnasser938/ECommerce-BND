import { User } from 'src/user/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({})
export class VerificationCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  validUntil: Date;

  @Column()
  used: boolean;

  @ManyToOne(() => User, (user) => user.verificationCodes, { eager: true })
  user: User;
}
