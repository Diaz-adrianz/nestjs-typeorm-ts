import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Xendit, { XenditSdkError } from 'xendit-node';
import { LoggerService } from '../logger/logger.service';
import {
  CreatePaymentRequestRequest,
  GetAllPaymentRequestsRequest,
} from 'xendit-node/payment_request/apis';

@Injectable()
export class XenditService {
  client: Xendit;

  constructor(
    private readonly configService: ConfigService,
    private readonly loggerService: LoggerService
  ) {
    this.client = new Xendit({
      secretKey: configService.getOrThrow('XENDIT_API_KEY'),
    });
  }

  async createPaymentRequest(params: CreatePaymentRequestRequest) {
    try {
      const res = await this.client.PaymentRequest.createPaymentRequest(params);
      return res;
    } catch (error) {
      if (error instanceof XenditSdkError) {
        this.loggerService.error(error.rawResponse);

        if (error.errorCode == 'API_VALIDATION_ERROR') {
          throw new BadRequestException(error.rawResponse);
        }
        if (
          error.errorCode == 'INVALID_PAYMENT_METHOD' ||
          error.errorCode == 'CHANNEL_NOT_ACTIVATED' ||
          error.errorCode == 'CHANNEL_UNAVAILABLE'
        )
          throw new BadRequestException('Payment method unanvilable');
      }
      throw error;
    }
  }

  async getPaymentRequest(id: string) {
    try {
      const res = await this.client.PaymentRequest.getPaymentRequestByID({
        paymentRequestId: id,
      });
      return res;
    } catch (error) {
      if (error instanceof XenditSdkError) {
        this.loggerService.error(error.rawResponse);
        if (error.errorCode == 'DATA_NOT_FOUND')
          throw new NotFoundException('Xendit payment not found');
      }
      throw error;
    }
  }

  async listPaymentRequest(params: GetAllPaymentRequestsRequest) {
    try {
      const res =
        await this.client.PaymentRequest.getAllPaymentRequests(params);
      return res;
    } catch (error) {
      if (error instanceof XenditSdkError) {
        this.loggerService.error(error.rawResponse);
      }
      throw error;
    }
  }
}
