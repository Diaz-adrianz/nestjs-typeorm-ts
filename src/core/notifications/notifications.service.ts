import { Injectable } from '@nestjs/common';
import {
  CreateNotificationDto,
  CreateTokenDto,
} from './dto/create-notification.dto';
import {
  MarkReadDto,
  UpdateNotificationDto,
} from './dto/update-notification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { In, Repository } from 'typeorm';
import { BrowseQueryTransformed } from 'src/utils/browse-query.utils';
import { NotificationToken } from './entities/notification-token.entity';
import { UserNotification } from './entities/user-notifications.entity';
import { FirebaseService } from 'src/lib/firebase/firebase.service';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepo: Repository<Notification>,
    @InjectRepository(NotificationToken)
    private notificationTokenRepo: Repository<NotificationToken>,
    @InjectRepository(UserNotification)
    private userNotificationRepo: Repository<UserNotification>,
    private readonly firebaseService: FirebaseService
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

  async setUsers(id: string, userIds: string[]) {
    await this.userNotificationRepo.delete({ notification: { id } });
    await this.userNotificationRepo.insert(
      userIds.map((uid) => ({
        user: { id: uid },
        notification: { id },
      }))
    );
    await this.notify(id);
  }

  async notify(id: string) {
    const notif = await this.findOne(id);
    const userTokens = await this.notificationTokenRepo.findBy({
      user: {
        id: In(notif.users.filter((un) => !!un.user).map((un) => un.user.id)),
      },
      isActive: true,
    });

    try {
      await this.firebaseService.sendMessage(
        userTokens.map((ut) => ut.token),
        {
          title: notif.title,
          body: notif.body,
        }
      );
    } catch {}
  }

  async create({ userIds, ...body }: CreateNotificationDto) {
    const notif = await this.notificationRepo.save(body);
    if (userIds?.length) await this.setUsers(notif.id, userIds);
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

  async update(id: string, { userIds, ...body }: UpdateNotificationDto) {
    const notif = await this.findOne(id);
    await this.notificationRepo.save({ ...notif, ...body });
    if (userIds?.length) await this.setUsers(notif.id, userIds);
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
