import { Role } from 'src/core/roles/entities/role.entity';

export type JwtPayload = {
  sub: string;
  username: string;
  iat?: number;
  exp?: number;
  iss?: string;
};

export type ReqUser = {
  id: string;
  username: string;
  active_role?: Role;
  hasPermission?: boolean;
};
