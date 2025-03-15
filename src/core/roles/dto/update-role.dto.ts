import { PartialType } from '@nestjs/mapped-types';
import { CreateRoleDto } from './create-role.dto';
import { IsArray, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { ExistsInDatabase } from 'src/validators/exist-in-database.validator';
import { Permission } from 'src/core/permissions/entities/permission.entity';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
  @IsArray()
  @ExistsInDatabase(Permission, 'id', { each: true })
  @IsUUID('4', { each: true })
  @IsNotEmpty({ each: true })
  @IsOptional()
  permissionIds?: string[];
}
