import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'src/decorators/user.decorator';
import { ReqUser } from 'src/types/jwt.type';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { AssignUserRolesDto, UpdateUserDto } from './dto/update-user.dto';
import { ParamUUID } from 'src/decorators/param.decorator';
import { BrowseQuery } from 'src/base/dto.base';
import { Private } from 'src/decorators/private.decorator';
import { transformBrowseQuery } from 'src/utils/browse-query.utils';
import { CreateUserDto } from './dto/create-user.dto';
import { FileFields } from 'src/decorators/file-fields.decorator';
import { Files } from 'src/decorators/files.decorator';
import { mbToBytes } from 'src/utils/converter.util';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @Private()
  findMe(@User() user: ReqUser) {
    return this.usersService.findOne(user.id);
  }

  @Patch('change-avatar')
  @Private()
  @FileFields({ avatar: 1 })
  changeAvatar(
    @Files({
      avatar: {
        maxBytes: mbToBytes(3),
        mimeTypes: ['image/png', 'image/jpeg', 'image/jpg'],
      },
    })
    files: {
      avatar?: Array<Express.Multer.File>;
    }
  ) {
    return files;
  }

  @Patch(':user_id/assign-roles')
  @Private({ permissions: ['users/assign-roles'] })
  assignRoles(
    @ParamUUID('user_id') userId: string,
    @Body() body: AssignUserRolesDto
  ) {
    return this.usersService.assignRoles(userId, body.items);
  }

  @Post()
  @Private({ permissions: ['users/create'] })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Private({ permissions: ['users/find-all'] })
  findAll(@Query() query: BrowseQuery) {
    const q = transformBrowseQuery(query);
    return this.usersService.findAll(q);
  }

  @Get(':id')
  @Private({ permissions: ['users/find-one'] })
  findOne(@ParamUUID('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @Private({ permissions: ['users/update'] })
  update(@ParamUUID('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id/soft')
  @Private({ permissions: ['users/soft-delete'] })
  softDelete(@ParamUUID('id') id: string) {
    return this.usersService.softDelete(id);
  }

  @Patch(':id/restore')
  @Private({ permissions: ['users/restore'] })
  restore(@ParamUUID('id') id: string) {
    return this.usersService.restore(id);
  }

  @Delete(':id/hard')
  @Private({ permissions: ['users/hard-delete'] })
  hardDelete(@ParamUUID('id') id: string) {
    return this.usersService.hardDelete(id);
  }
}
