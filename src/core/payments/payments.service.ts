import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Repository } from 'typeorm';
import { BrowseQueryTransformed } from 'src/utils/browse-query.utils';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment) private paymentRepo: Repository<Payment>
  ) {}

  create(createPaymentDto: CreatePaymentDto) {
    return this.paymentRepo.insert(createPaymentDto);
  }

  findAll(query: BrowseQueryTransformed) {
    return this.paymentRepo.findAndCount(query);
  }

  findOne(id: string) {
    return this.paymentRepo.findOneOrFail({ where: { id } });
  }

  update(id: string, updatePaymentDto: UpdatePaymentDto) {
    return this.paymentRepo.update({ id }, updatePaymentDto);
  }

  softDelete(id: string) {
    return this.paymentRepo.softDelete({ id });
  }

  restore(id: string) {
    return this.paymentRepo.restore({ id });
  }

  hardDelete(id: string) {
    return this.paymentRepo.delete({ id });
  }
}
