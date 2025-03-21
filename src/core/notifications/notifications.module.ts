import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { UserNotification } from './entities/user-notifications.entity';
import { NotificationToken } from './entities/notification-token.entity';
import { FirebaseModule } from 'src/lib/firebase/firebase.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Notification,
      UserNotification,
      NotificationToken,
    ]),
    FirebaseModule,
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
})
export class NotificationsModule {}
