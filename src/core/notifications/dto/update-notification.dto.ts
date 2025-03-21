import { PartialType } from '@nestjs/mapped-types';
import { CreateNotificationDto } from './create-notification.dto';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class UpdateNotificationDto extends PartialType(CreateNotificationDto) {}

export class MarkReadDto {
  @IsArray()
  @IsUUID('4', { each: true })
  @IsNotEmpty({ each: true })
  @IsNotEmpty()
  notificationIds: string[];
}

export class SetUsersDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID('4', { each: true })
  @IsNotEmpty({ each: true })
  @IsNotEmpty()
  userIds: string[];
}
