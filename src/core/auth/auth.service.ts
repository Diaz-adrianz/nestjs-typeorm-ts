import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RefreshToken, SignInEmail } from './dto/sign-in.dto';
import { FindOptionsWhere, Repository } from 'typeorm';
import { User, UserProvider } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from 'src/types/jwt.type';
import { CacheService } from 'src/lib/cache/cache.service';
import { SignUpEmail, VerifyEmail } from './dto/sign-up.dto';
import { MailService } from 'src/lib/mail/mail.service';
import { generateOtp } from 'src/utils/generator.utils';
import { randomUUID } from 'crypto';
import { OtpPayload } from 'src/types/cache.type';
import { Role } from '../roles/entities/role.entity';
import { UserRole } from '../users/entities/user-role.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Role) private roleRepo: Repository<Role>,
    @InjectRepository(UserRole) private userRoleRepo: Repository<UserRole>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private cacheService: CacheService,
    private mailService: MailService
  ) {}

  async signInEmail(body: SignInEmail) {
    const user = await this.getValidUser({ email: body.email });

    if (!user.password || user.provider != UserProvider.EMAIL)
      throw new UnauthorizedException(
        'This user is not registered with password method. Please sign in using another method'
      );

    const passwordValid = await bcrypt.compare(body.password, user.password);
    if (!passwordValid) throw new BadRequestException('Invalid password');

    delete user.password;

    const tokens = {
      access: await this.generateAccessToken({
        sub: user.id,
        username: user.username,
      }),
      refresh: await this.generateRefreshToken({
        sub: user.id,
        username: user.username,
      }),
    };

    await this.cacheService.set(
      `refresh:${user.id}`,
      tokens.refresh,
      +this.configService.getOrThrow('JWT_REFRESH_EXPIRE') * 1000
    );

    return {
      user,
      tokens,
    };
  }

  async signUpEmail(body: SignUpEmail) {
    const sameEmail = await this.userRepo.count({
      where: { email: body.email },
    });
    if (sameEmail) throw new BadRequestException('Email has been registered');

    const sameUsername = await this.userRepo.count({
      where: { username: body.username },
    });
    if (sameUsername) throw new BadRequestException('Username already exist');

    const newUser = this.userRepo.create({
      ...body,
      provider: UserProvider.EMAIL,
    });

    await this.userRepo.insert(newUser);
    await this.sendEmailVerification(newUser.email);

    newUser.removePassword();
    return newUser;
  }

  async sendEmailVerification(email: string) {
    const user = await this.userRepo.findOne({
      where: { email },
      select: { isVerified: true },
    });
    if (!user) throw new NotFoundException('User not found');
    if (user.isVerified)
      throw new BadRequestException('Email already verified');

    const otpCode = generateOtp();
    const otpExpiry = +this.configService.getOrThrow('VERIFY_EMAIL_EXPIRED');
    const verifyPageURL = `${this.configService.getOrThrow('CLIENT_PAGE_URL')}/auth/verify-email`;

    await this.cacheService.set(`otp:${otpCode}`, email, otpExpiry * 1000);
    await this.mailService.send({
      to: email,
      subject: 'Email Verification',
      html: {
        fileName: 'email-verification.html',
        payload: {
          otpCode,
          verifyPageURL,
          otpExpiry: otpExpiry / 60 + ' minutes',
        },
      },
    });
  }

  async verifyEmail(body: VerifyEmail) {
    const email = await this.cacheService.get<string>(`otp:${body.otp}`);
    if (!email) throw new ForbiddenException('Invalid OTP, please try again.');

    const user = await this.userRepo.findOne({
      where: { email },
      relations: { roles: true },
    });
    if (!user) throw new NotFoundException();

    await this.userRepo.update(
      { id: user.id },
      { isVerified: true, isActive: true }
    );

    const role = await this.roleRepo.findOneBy({ name: 'user' });
    if (role) {
      await this.userRoleRepo.upsert(
        {
          isActive: true,
          role: role,
          user: user,
        },
        {
          conflictPaths: ['user', 'role'],
        }
      );
    }
  }

  async refreshToken(body: RefreshToken) {
    const decoded = this.jwtService.decode<JwtPayload>(body.refresh);

    try {
      this.jwtService.verify<JwtPayload>(body.refresh, {
        secret: this.configService.getOrThrow('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid session. Please re-login.');
    }

    const cachedToken = await this.cacheService.get(`refresh:${decoded.sub}`);
    if (!cachedToken || body.refresh !== cachedToken)
      throw new UnauthorizedException('Expired session. Please re-login.');

    const tokens = {
      access: await this.generateAccessToken(decoded),
      refresh: await this.generateRefreshToken(decoded),
    };

    const user = await this.getValidUser({ id: decoded.sub });

    await this.cacheService.set(
      `refresh:${user.id}`,
      tokens.refresh,
      +this.configService.getOrThrow('JWT_REFRESH_EXPIRE') * 1000
    );

    return { tokens };
  }

  async signOut(userId: string) {
    this.cacheService.del(`refresh:${userId}`);
  }

  async getValidUser(where: FindOptionsWhere<User>): Promise<User> {
    const user = await this.userRepo.findOne({
      where,
    });

    if (!user) throw new NotFoundException('User not found');

    if (!user.isVerified)
      throw new ForbiddenException('Email not verified yet');

    if (!user.isActive) throw new ForbiddenException('Access suspended');

    return user;
  }

  generateAccessToken(payload: JwtPayload) {
    return this.jwtService.signAsync(
      {
        sub: payload.sub,
        username: payload.username,
      },
      {
        secret: this.configService.getOrThrow('JWT_ACCESS_SECRET'),
        expiresIn: +this.configService.getOrThrow('JWT_ACCESS_EXPIRE'),
        issuer: this.configService.getOrThrow('JWT_ISSUER'),
      }
    );
  }

  generateRefreshToken(payload: JwtPayload) {
    return this.jwtService.signAsync(
      {
        sub: payload.sub,
        username: payload.username,
      },
      {
        secret: this.configService.getOrThrow('JWT_REFRESH_SECRET'),
        expiresIn: +this.configService.getOrThrow('JWT_REFRESH_EXPIRE'),
        issuer: this.configService.getOrThrow('JWT_ISSUER'),
      }
    );
  }
}
