import { BaseEntity } from 'src/base/entity.base';
import { User } from 'src/core/users/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

export enum PaymentStatus {
  PENDING = 'pending',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
  EXPIRED = 'expired',
}

@Entity({ schema: 'transaction', name: 'payments' })
export class Payment extends BaseEntity {
  @Column()
  amount: number;

  @Column()
  currency: string;

  @Column()
  countryCode: string;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @Column({ nullable: true })
  method?: boolean;

  @Column({ nullable: true })
  channel?: boolean;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  referenceId?: string;

  @Column({ nullable: true })
  failedReason?: string;

  @ManyToOne(() => User, (user) => user.payments, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  user?: User;
}
