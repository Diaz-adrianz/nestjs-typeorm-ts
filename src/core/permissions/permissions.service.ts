import { Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './entities/permission.entity';
import { BrowseQueryTransformed } from 'src/utils/browse-query.utils';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission) private permissionRepo: Repository<Permission>
  ) {}

  create(createPermissionDto: CreatePermissionDto) {
    return this.permissionRepo.insert(createPermissionDto);
  }

  findAll(query: BrowseQueryTransformed) {
    return this.permissionRepo.findAndCount(query);
  }

  findOne(id: string) {
    return this.permissionRepo.findOneOrFail({ where: { id } });
  }

  update(id: string, updatePermissionDto: UpdatePermissionDto) {
    return this.permissionRepo.update({ id }, updatePermissionDto);
  }

  softDelete(id: string) {
    return this.permissionRepo.softDelete({ id });
  }

  restore(id: string) {
    return this.permissionRepo.restore({ id });
  }

  hardDelete(id: string) {
    return this.permissionRepo.delete({ id });
  }
}
