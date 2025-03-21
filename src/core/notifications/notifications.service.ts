import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { Repository } from 'typeorm';
import { BrowseQueryTransformed } from 'src/utils/browse-query.utils';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepo: Repository<Notification>
  ) {}

  create(body: CreateNotificationDto) {
    return this.notificationRepo.insert(body);
  }

  findAll(query: BrowseQueryTransformed) {
    return this.notificationRepo.findAndCount(query);
  }

  findOne(id: string) {
    return this.notificationRepo.findOneOrFail({ where: { id } });
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
