import { BaseEntity } from 'src/base/entity.base';
import { User } from 'src/core/users/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

export enum PaymentStatus {
  PENDING = 'pending',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
  EXPIRED = 'expired',
}

export enum PaymentCurrency {
  IDR = 'IDR',
  USD = 'USD',
}

export enum PaymentCountryCode {
  ID = 'ID',
  US = 'US',
}

@Entity({ schema: 'transaction', name: 'payments' })
export class Payment extends BaseEntity {
  @Column()
  amount: number;

  @Column({ type: 'enum', enum: PaymentCurrency })
  currency: PaymentCurrency;

  @Column({ type: 'enum', enum: PaymentCountryCode })
  countryCode: PaymentCountryCode;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @Column({ nullable: true })
  method?: string;

  @Column({ nullable: true })
  channel?: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  referenceId?: string;

  @Column({ nullable: true })
  failedReason?: string;

  @Column({ type: 'timestamp', default: () => 'NOW()' })
  statusUpdatedAt: Date;

  @ManyToOne(() => User, (user) => user.payments, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  user?: User;
}
