import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Role } from 'src/core/roles/entities/role.entity';
import { PERMISSIONS } from 'src/decorators/permissions.decorator';
import { ReqUser } from 'src/types/jwt.type';
import { DataSource } from 'typeorm';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(DataSource) private readonly dataSource: DataSource
  ) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const permissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS,
      [context.getHandler(), context.getClass()]
    );

    const req = context.switchToHttp().getRequest();
    const activeRole = (req.user as ReqUser)?.active_role;

    const roleRepo = this.dataSource.getRepository(Role);
    return activeRole
      ? roleRepo
          .findOne({
            where: { id: activeRole.id, isActive: true },
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
  }
}
