import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ReqUser, JwtPayload } from 'src/types/jwt.type';
import { User } from 'src/core/users/entities/user.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject() private configService: ConfigService,
    @Inject(DataSource) private readonly dataSource: DataSource
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_ACCESS_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<ReqUser> {
    const userRepo = this.dataSource.getRepository(User);
    const user = await userRepo.findOne({
      where: { id: payload.sub },
      relations: { roles: { role: true } },
    });

    if (!user) throw new NotFoundException('User not found');

    if (!user.isVerified)
      throw new ForbiddenException('Email not verified yet');

    if (!user.isActive) throw new ForbiddenException('Access suspended');

    return {
      id: payload.sub,
      username: payload.username,
      active_role: user?.roles.find((role) => role.isActive)?.role,
    };
  }
}
