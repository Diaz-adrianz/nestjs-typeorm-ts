import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { In, Repository } from 'typeorm';
import { BrowseQueryTransformed } from 'src/utils/browse-query.utils';
import { Permission } from '../permissions/entities/permission.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private roleRepo: Repository<Role>,
    @InjectRepository(Permission) private permissionRepo: Repository<Permission>
  ) {}

  create(createRoleDto: CreateRoleDto) {
    return this.roleRepo.insert(createRoleDto);
  }

  findAll(query: BrowseQueryTransformed) {
    return this.roleRepo.findAndCount(query);
  }

  findOne(id: string) {
    return this.roleRepo.findOneOrFail({
      where: { id },
      relations: { permissions: true },
    });
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    const role = await this.findOne(id);
    Object.assign(role, updateRoleDto);

    if (updateRoleDto.permissionIds)
      role.permissions = await this.permissionRepo.findBy({
        id: In(updateRoleDto.permissionIds),
      });

    return this.roleRepo.save(role);
  }

  softDelete(id: string) {
    return this.roleRepo.softDelete({ id });
  }

  restore(id: string) {
    return this.roleRepo.restore({ id });
  }

  hardDelete(id: string) {
    return this.roleRepo.delete({ id });
  }
}
