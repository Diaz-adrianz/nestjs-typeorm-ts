import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmOptions } from './config/typeorm.config';
import { RolesModule } from './core/roles/roles.module';
import { UsersModule } from './core/users/users.module';
import { PermissionsModule } from './core/permissions/permissions.module';
import { AuthModule } from './core/auth/auth.module';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ClassValidatorPipe } from './pipes/class-validator.pipe';
import { CatchAllFilter } from './filters/catch-all.filter';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { ClassValidatorFilter } from './filters/class-validator.filter';
import { CacheModule } from './lib/cache/cache.module';
import { JwtStrategy } from './core/auth/strategy/jwt.strategy';
import { TypeormFilter } from './filters/typeorm.filter';
import { ExistsInDatabaseConstraint } from './validators/exist-in-database.validator';
import { MailModule } from './lib/mail/mail.module';
import { LoggerModule } from './lib/logger/logger.module';
import { MinioModule } from './lib/minio/minio.module';
import { PaymentsModule } from './core/payments/payments.module';
import { XenditModule } from './lib/xendit/xendit.module';
import { NotificationsModule } from './core/notifications/notifications.module';
import { FirebaseModule } from './lib/firebase/firebase.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(typeOrmOptions as TypeOrmModule),
    CacheModule,
    RolesModule,
    UsersModule,
    PermissionsModule,
    AuthModule,
    MailModule,
    LoggerModule,
    MinioModule,
    PaymentsModule,
    XenditModule,
    NotificationsModule,
    FirebaseModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtStrategy,
    ExistsInDatabaseConstraint,
    {
      provide: APP_PIPE,
      useClass: ClassValidatorPipe,
    },
    {
      provide: APP_FILTER,
      useClass: CatchAllFilter,
    },
    {
      provide: APP_FILTER,
      useClass: ClassValidatorFilter,
    },
    {
      provide: APP_FILTER,
      useClass: TypeormFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
