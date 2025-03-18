import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment, PaymentMethod } from './entities/payment.entity';
import { Repository } from 'typeorm';
import { BrowseQueryTransformed } from 'src/utils/browse-query.utils';
import { XenditService } from 'src/lib/xendit/xendit.service';
import { PaymentRequestParameters } from 'xendit-node/payment_request/models';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment) private paymentRepo: Repository<Payment>,
    @InjectRepository(User) private userRepo: Repository<User>,
    private readonly xenditService: XenditService
  ) {}

  async create({ userId, ...payload }: CreatePaymentDto) {
    const user = await this.userRepo.findOneBy({ id: userId });

    const payment = this.paymentRepo.create({
      ...payload,
      user: { id: user?.id },
    });

    const xenditParams: PaymentRequestParameters = {
      currency: payload.currency,
      amount: payload.amount,
      metadata: {
        paymentId: payment.id,
      },
    };

    if (payload.method == PaymentMethod.EWALLET) {
      if (!payload.succeedCallbackUrl || !payload.failedCallbackUrl)
        throw new BadRequestException('E-wallet method require callback URL');

      xenditParams.paymentMethod = {
        type: 'EWALLET',
        reusability: 'ONE_TIME_USE',
        ewallet: {
          channelCode: payload.channel as any,
          channelProperties: {
            successReturnUrl: payload.succeedCallbackUrl,
            failureReturnUrl: payload.failedCallbackUrl,
          },
        },
      };
    } else if (payload.method == PaymentMethod.VIRTUAL_ACCOUNT) {
      if (!user)
        throw new BadRequestException('Virtual account method require user');

      xenditParams.paymentMethod = {
        type: 'VIRTUAL_ACCOUNT',
        reusability: 'ONE_TIME_USE',
        virtualAccount: {
          amount: payload.amount,
          channelCode: payload.channel as any,
          currency: payload.currency,
          channelProperties: {
            customerName: user.username,
            expiresAt: payload.expiredAt,
          },
        },
      };
    } else if (payload.method == PaymentMethod.OVER_THE_COUNTER) {
      if (!user)
        throw new BadRequestException('Over the counter method require user');

      xenditParams.paymentMethod = {
        type: 'OVER_THE_COUNTER',
        reusability: 'ONE_TIME_USE',
        overTheCounter: {
          channelCode: payload.channel as any,
          amount: payload.amount,
          currency: payload.currency,
          channelProperties: {
            customerName: user.username,
            expiresAt: payload.expiredAt,
          },
        },
      };
    }

    const res = await this.xenditService.createPaymentRequest({
      data: xenditParams,
    });

    payment.referenceId = res.id;

    return this.paymentRepo.save(payment);
  }

  findAll(query: BrowseQueryTransformed) {
    return this.paymentRepo.findAndCount({
      ...query,
      relations: { user: true },
      select: {
        user: { id: true, username: true, avatar: true },
      },
    });
  }

  async findOne(id: string) {
    const payment = await this.paymentRepo.findOneOrFail({
      where: { id },
      relations: { user: true },
      select: {
        user: {
          id: true,
          username: true,
          avatar: true,
          email: true,
        },
      },
    });

    if (payment.referenceId)
      payment.xenditPayment = await this.xenditService.getPaymentRequest(
        payment.referenceId
      );

    return payment;
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
