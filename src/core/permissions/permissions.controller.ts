import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Private } from 'src/decorators/private.decorator';
import { BrowseQuery } from 'src/base/dto.base';
import { transformBrowseQuery } from 'src/utils/browse-query.utils';
import { ParamUUID } from 'src/decorators/param.decorator';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  @Private({ permissions: ['permissions/create'] })
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionsService.create(createPermissionDto);
  }

  @Get()
  @Private({ permissions: ['permissions/find-all'] })
  findAll(@Query() query: BrowseQuery) {
    const q = transformBrowseQuery(query);
    return this.permissionsService.findAll(q);
  }

  @Get(':id')
  @Private({ permissions: ['permissions/find-one'] })
  findOne(@ParamUUID('id') id: string) {
    return this.permissionsService.findOne(id);
  }

  @Patch(':id')
  @Private({ permissions: ['permissions/update'] })
  update(
    @ParamUUID('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto
  ) {
    return this.permissionsService.update(id, updatePermissionDto);
  }

  @Delete(':id/soft')
  @Private({ permissions: ['permissions/soft-delete'] })
  softDelete(@ParamUUID('id') id: string) {
    return this.permissionsService.softDelete(id);
  }

  @Patch(':id/restore')
  @Private({ permissions: ['permissions/restore'] })
  restore(@ParamUUID('id') id: string) {
    return this.permissionsService.restore(id);
  }

  @Delete(':id/hard')
  @Private({ permissions: ['permissions/hard-delete'] })
  hardDelete(@ParamUUID('id') id: string) {
    return this.permissionsService.hardDelete(id);
  }
}
