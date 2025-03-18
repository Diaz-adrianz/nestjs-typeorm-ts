import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_STRICT = 'permissions_strict';
export const PermissionsStrict = (strict: boolean = true) =>
  SetMetadata(PERMISSIONS_STRICT, strict);
