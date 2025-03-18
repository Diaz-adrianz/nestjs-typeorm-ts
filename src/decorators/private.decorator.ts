import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/core/auth/guards/jwt.guard';
import { Permissions } from './permissions.decorator';
import { PermissionsGuard } from 'src/core/auth/guards/permissions.guard';
import { PERMISSIONS_STRICT } from './permissions-strict.decorator';

interface Params {
  permissions?: string[];
  strict?: boolean;
}

export function Private({ permissions = [], strict = true }: Params = {}) {
  return applyDecorators(
    Permissions(...permissions),
    SetMetadata(PERMISSIONS_STRICT, strict),
    UseGuards(JwtGuard, PermissionsGuard)
  );
}
