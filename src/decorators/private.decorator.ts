import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/core/auth/guards/jwt.guard';
import { Permissions } from './permissions.decorator';
import { PermissionsGuard } from 'src/core/auth/guards/permissions.guard';

interface Params {
  permissions: string[];
}
export function Private({ permissions }: Params) {
  return applyDecorators(
    Permissions(...permissions),
    UseGuards(JwtGuard, PermissionsGuard)
  );
}
