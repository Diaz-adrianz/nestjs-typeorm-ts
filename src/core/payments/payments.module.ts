import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { XenditModule } from 'src/lib/xendit/xendit.module';
import { User } from '../users/entities/user.entity';
import { MinioModule } from 'src/lib/minio/minio.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, User]),
    XenditModule,
    MinioModule,
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
