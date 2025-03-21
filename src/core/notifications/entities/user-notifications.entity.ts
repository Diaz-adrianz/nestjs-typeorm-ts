import { BaseEntity } from 'src/base/entity.base';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Notification } from './notification.entity';
import { User } from 'src/core/users/entities/user.entity';

@Entity({ schema: 'notification', name: 'user_notifications' })
export class UserNotification extends BaseEntity {
  @ManyToOne(() => User, (user) => user.notifications, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Notification, (n) => n.users, {
    onDelete: 'CASCADE',
  })
  notification: Notification;

  @Column({ default: false })
  isRead: Boolean;
}
