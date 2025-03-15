import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Private } from 'src/decorators/private.decorator';
import { ParamUUID } from 'src/decorators/param.decorator';
import { BrowseQuery } from 'src/base/dto.base';
import { transformBrowseQuery } from 'src/utils/browse-query.utils';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @Private({ permissions: ['roles/create'] })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @Private({ permissions: ['roles/find-all'] })
  findAll(@Query() query: BrowseQuery) {
    const q = transformBrowseQuery(query);
    return this.rolesService.findAll(q);
  }

  @Get(':id')
  @Private({ permissions: ['roles/find-one'] })
  findOne(@ParamUUID('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  @Private({ permissions: ['roles/update'] })
  update(@ParamUUID('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(id, updateRoleDto);
  }

  @Delete(':id/soft')
  @Private({ permissions: ['roles/soft-delete'] })
  softDelete(@ParamUUID('id') id: string) {
    return this.rolesService.softDelete(id);
  }

  @Patch(':id/restore')
  @Private({ permissions: ['roles/restore'] })
  restore(@ParamUUID('id') id: string) {
    return this.rolesService.restore(id);
  }

  @Delete(':id/hard')
  @Private({ permissions: ['roles/hard-delete'] })
  hardDelete(@ParamUUID('id') id: string) {
    return this.rolesService.hardDelete(id);
  }
}
