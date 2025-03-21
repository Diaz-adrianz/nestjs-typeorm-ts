import { BaseEntity } from 'src/base/entity.base';
import { User } from 'src/core/users/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ schema: 'notification', name: 'notification_tokens' })
export class NotificationToken extends BaseEntity {
  @ManyToOne(() => User, (user) => user.notificationTokens, {
    onDelete: 'CASCADE',
  })
  user: User;

  @Column()
  token: string;

  @Column()
  deviceId: string;

  @Column({ default: true })
  isActive: boolean;
}
