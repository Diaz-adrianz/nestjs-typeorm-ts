import { BaseEntity } from 'src/base/entity.base';
import { Column, Entity, OneToMany } from 'typeorm';
import { UserNotification } from './user-notifications.entity';

export enum NotificationType {
  GENERAL = 'general',
  PAYMENT = 'payment',
}

@Entity({ schema: 'notification', name: 'notifications' })
export class Notification extends BaseEntity {
  @Column({
    type: 'enum',
    enum: NotificationType,
    default: NotificationType.GENERAL,
  })
  type: NotificationType;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  body?: string;

  @Column({ type: 'json', nullable: true })
  metadata?: Record<string, any>;

  @OneToMany(() => UserNotification, (un) => un.notification)
  users: UserNotification[];
}
