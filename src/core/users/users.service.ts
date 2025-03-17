import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { AssignUserRoleDto, UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRole } from './entities/user-role.entity';
import { Repository } from 'typeorm';
import { BrowseQueryTransformed } from 'src/utils/browse-query.utils';
import { MinioService } from 'src/lib/minio/minio.service';
import { File } from 'src/pipes/files-validator.pipe';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(UserRole) private userRoleRepo: Repository<UserRole>,
    private readonly minioService: MinioService
  ) {}

  async changeAvatar(userId: string, file: File) {
    const user = await this.findOne(userId);
    const oldPath = user.avatar;

    const uploaded = await this.minioService.upload({
      bucket: 'user-avatars',
      file: file,
    });
    user.avatar = uploaded.path;
    await this.userRepo.save(user);

    if (oldPath)
      try {
        await this.minioService.delete({
          bucket: 'user-avatars',
          path: oldPath,
        });
      } catch {}
  }

  create(createUserDto: CreateUserDto) {
    return this.userRepo.insert(createUserDto);
  }

  findAll(query: BrowseQueryTransformed) {
    return this.userRepo.findAndCount(query);
  }

  findOne(id: string) {
    return this.userRepo.findOneOrFail({
      where: { id },
      relations: {
        roles: {
          role: true,
        },
      },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.userRepo.update({ id }, updateUserDto);
  }

  softDelete(id: string) {
    return this.userRepo.softDelete({ id });
  }

  restore(id: string) {
    return this.userRepo.restore({ id });
  }

  hardDelete(id: string) {
    return this.userRepo.delete({ id });
  }

  async assignRoles(userId: string, body: AssignUserRoleDto[]) {
    const activeRoles = body.filter((item) => item.is_active);

    if (activeRoles.length == 0)
      throw new BadRequestException('There must be on active role');

    if (activeRoles.length > 1)
      throw new BadRequestException('There can only be one active role');

    const userRoles = this.userRoleRepo.create(
      body.map((item) => ({
        user: { id: userId },
        role: { id: item.role_id },
        isActive: item.is_active,
      }))
    );

    await this.userRoleRepo.delete({ user: { id: userId } });
    await this.userRoleRepo.insert(userRoles);

    return userRoles;
  }
}
