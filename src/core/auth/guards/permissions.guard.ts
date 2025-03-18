import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/core/roles/entities/role.entity';
import { PERMISSIONS_STRICT } from 'src/decorators/permissions-strict.decorator';
import { PERMISSIONS } from 'src/decorators/permissions.decorator';
import { ReqUser } from 'src/types/jwt.type';
import { DataSource } from 'typeorm';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly dataSource: DataSource
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS,
      [context.getHandler(), context.getClass()]
    );
    const strict = this.reflector.getAllAndOverride<boolean>(
      PERMISSIONS_STRICT,
      [context.getHandler(), context.getClass()]
    );

    if (!permissions.length) return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user as ReqUser;

    const roleRepo = this.dataSource.getRepository(Role);
    const hasPermission = user.active_role?.id
      ? await roleRepo
          .findOne({
            where: { id: user.active_role.id, isActive: true },
            relations: { permissions: true },
          })
          .then(
            (role) =>
              (role?.permissions ?? [])
                .filter((perm) => !!perm)
                .map((perm) => `${perm.feature}/${perm.action}`)
                .filter((val) => permissions.includes(val)).length > 0
          )
      : false;

    user.hasPermission = hasPermission;

    return strict ? hasPermission : true;
  }
}
