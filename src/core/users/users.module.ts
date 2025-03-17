import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRole } from './entities/user-role.entity';
import { MinioModule } from 'src/lib/minio/minio.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserRole]), MinioModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
