import { Injectable } from '@nestjs/common';
import {
  CreateNotificationDto,
  CreateTokenDto,
} from './dto/create-notification.dto';
import {
  MarkReadDto,
  SetUsersDto,
  UpdateNotificationDto,
} from './dto/update-notification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { In, Repository } from 'typeorm';
import { BrowseQueryTransformed } from 'src/utils/browse-query.utils';
import { NotificationToken } from './entities/notification-token.entity';
import { UserNotification } from './entities/user-notifications.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepo: Repository<Notification>,
    @InjectRepository(NotificationToken)
    private notificationTokenRepo: Repository<NotificationToken>,
    @InjectRepository(UserNotification)
    private userNotificationRepo: Repository<UserNotification>
  ) {}

  createToken(userId: string, body: CreateTokenDto) {
    return this.notificationTokenRepo.upsert(
      {
        user: { id: userId },
        ...body,
      },
      { conflictPaths: { deviceId: true, user: true } }
    );
  }

  markRead(userId: string, body: MarkReadDto) {
    this.userNotificationRepo.update(
      {
        notification: { id: In(body.notificationIds) },
        user: { id: userId },
      },
      { isRead: true }
    );
  }

  setUsers(id: string, body: SetUsersDto) {
    this.userNotificationRepo.delete({ notification: { id } }).then(() =>
      this.userNotificationRepo.insert(
        body.userIds.map((uid) => ({
          user: { id: uid },
          notification: { id },
        }))
      )
    );
  }

  create(body: CreateNotificationDto) {
    return this.notificationRepo.insert(body);
  }

  findAll(query: BrowseQueryTransformed) {
    return this.notificationRepo.findAndCount(query);
  }

  findOne(id: string) {
    return this.notificationRepo.findOneOrFail({
      where: { id },
      relations: { users: { user: true } },
      select: {
        users: {
          id: true,
          isRead: {},
          user: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    });
  }

  update(id: string, body: UpdateNotificationDto) {
    return this.notificationRepo.update({ id }, body);
  }

  softDelete(id: string) {
    return this.notificationRepo.softDelete({ id });
  }

  restore(id: string) {
    return this.notificationRepo.restore({ id });
  }

  hardDelete(id: string) {
    return this.notificationRepo.delete({ id });
  }
}
