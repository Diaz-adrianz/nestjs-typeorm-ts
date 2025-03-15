import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ExistsInDatabase } from 'src/validators/exist-in-database.validator';
import { Role } from 'src/core/roles/entities/role.entity';

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class AssignUserRoleDto {
  @ExistsInDatabase(Role, 'id')
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  role_id: string;

  @IsBoolean()
  @IsNotEmpty()
  is_active: string;
}

export class AssignUserRolesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AssignUserRoleDto)
  items: AssignUserRoleDto[];
}
