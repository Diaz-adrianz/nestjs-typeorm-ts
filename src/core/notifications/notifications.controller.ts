import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import {
  CreateNotificationDto,
  CreateTokenDto,
} from './dto/create-notification.dto';
import {
  MarkReadDto,
  UpdateNotificationDto,
} from './dto/update-notification.dto';
import { Private } from 'src/decorators/private.decorator';
import { ParamUUID } from 'src/decorators/param.decorator';
import { BrowseQuery } from 'src/base/dto.base';
import { fillQuery, transformBrowseQuery } from 'src/utils/browse-query.utils';
import { User } from 'src/decorators/user.decorator';
import { ReqUser } from 'src/types/jwt.type';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('create-token')
  @Private()
  createToken(@User() user: ReqUser, @Body() body: CreateTokenDto) {
    return this.notificationsService.createToken(user.id, body);
  }

  @Patch('mark-read')
  @Private()
  markRead(@User() user: ReqUser, @Body() body: MarkReadDto) {
    return this.notificationsService.markRead(user.id, body);
  }

  @Post()
  @Private({ permissions: ['notifications/create'] })
  create(@Body() body: CreateNotificationDto) {
    return this.notificationsService.create(body);
  }

  @Get()
  @Private({ permissions: ['notifications/find-all'], strict: false })
  findAll(@User() user: ReqUser, @Query() query: BrowseQuery) {
    const q = transformBrowseQuery(query);
    if (!user.hasPermission) fillQuery(q.where, 'users.user.id', user.id);
    return this.notificationsService.findAll(q);
  }

  @Get(':id')
  @Private({ permissions: ['notifications/find-one'] })
  findOne(@ParamUUID('id') id: string) {
    return this.notificationsService.findOne(id);
  }

  @Patch(':id')
  @Private({ permissions: ['notifications/update'] })
  update(@ParamUUID('id') id: string, @Body() body: UpdateNotificationDto) {
    return this.notificationsService.update(id, body);
  }

  @Delete(':id/soft')
  @Private({ permissions: ['notifications/soft-delete'] })
  softDelete(@ParamUUID('id') id: string) {
    return this.notificationsService.softDelete(id);
  }

  @Patch(':id/restore')
  @Private({ permissions: ['notifications/restore'] })
  restore(@ParamUUID('id') id: string) {
    return this.notificationsService.restore(id);
  }

  @Delete(':id/hard')
  @Private({ permissions: ['notifications/hard-delete'] })
  hardDelete(@ParamUUID('id') id: string) {
    return this.notificationsService.hardDelete(id);
  }
}
