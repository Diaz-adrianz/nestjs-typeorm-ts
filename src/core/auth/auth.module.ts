import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from 'src/lib/mail/mail.module';
import { Role } from '../roles/entities/role.entity';
import { UserRole } from '../users/entities/user-role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, UserRole]),
    JwtModule,
    MailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
