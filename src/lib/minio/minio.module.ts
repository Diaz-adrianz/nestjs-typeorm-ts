import { Module } from '@nestjs/common';
import { MinioService } from './minio.service';
import { MinioModule as NestMinioModule } from 'nestjs-minio-client';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    NestMinioModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        endPoint: configService.get('MINIO_ENDPOINT', 'localhost'),
        port: +configService.get('MINIO_PORT', 9000),
        useSSL: configService.get('MINIO_USESSL', false) == 'true',
        accessKey: configService.get('MINIO_ACCESSKEY', ''),
        secretKey: configService.get('MINIO_SECRETKEY', ''),
      }),
    }),
  ],
  providers: [MinioService],
  exports: [MinioService],
})
export class MinioModule {}
