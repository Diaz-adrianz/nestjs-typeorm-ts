import { Injectable } from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';
import {
  MinioClient,
  MinioService as NestMinioService,
} from 'nestjs-minio-client';
import { ReqFile } from 'src/pipes/files-validator.pipe';
import { createHash } from 'crypto';

@Injectable()
export class MinioService {
  constructor(
    private readonly minio: NestMinioService,
    private readonly loggerService: LoggerService
  ) {}

  public get client(): MinioClient {
    return this.minio.client;
  }

  public async upload({
    file,
    bucket,
  }: {
    file: ReqFile;
    bucket: string;
  }): Promise<{ bucket: string; fileName: string; path: string }> {
    try {
      const tempFilename = Date.now().toString();
      const hashedFileName = createHash('md5')
        .update(tempFilename)
        .digest('hex');
      const ext = file.originalname.substring(
        file.originalname.lastIndexOf('.')
      );
      const fileName = `${hashedFileName}${ext}`;

      if (!(await this.client.bucketExists(bucket)))
        await this.client.makeBucket(bucket);

      await this.client.putObject(bucket, fileName, file.buffer);

      return {
        bucket,
        fileName,
        path: `/${bucket}/${fileName}`,
      };
    } catch (err) {
      this.loggerService.error(err);
      throw err;
    }
  }

  async delete({ path, bucket }: { path: string; bucket: string }) {
    try {
      const objectName = path.replace(`/${bucket}/`, '');
      await this.client.removeObject(bucket, objectName);
    } catch (err) {
      this.loggerService.error(err);
      throw err;
    }
  }
}
