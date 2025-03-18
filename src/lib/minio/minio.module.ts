import { Module } from '@nestjs/common';
import { MinioService } from './minio.service';
import { MinioModule as NestMinioModule } from 'nestjs-minio-client';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    NestMinioModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        endPoint: configService.getOrThrow('MINIO_ENDPOINT'),
        port: +configService.getOrThrow('MINIO_PORT'),
        useSSL: configService.getOrThrow('MINIO_USESSL') == 'true',
        accessKey: configService.getOrThrow('MINIO_ACCESSKEY'),
        secretKey: configService.getOrThrow('MINIO_SECRETKEY'),
      }),
    }),
  ],
  providers: [MinioService],
  exports: [MinioService],
})
export class MinioModule {}
