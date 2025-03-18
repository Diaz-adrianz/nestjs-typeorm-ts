import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Query,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { ParamUUID } from 'src/decorators/param.decorator';
import { Private } from 'src/decorators/private.decorator';
import { transformBrowseQuery } from 'src/utils/browse-query.utils';
import { BrowseQuery } from 'src/base/dto.base';
import { ConfigService } from '@nestjs/config';
import { PaymentStatus } from './entities/payment.entity';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly configService: ConfigService
  ) {}

  @Post('xendit-webhook')
  xenditWebhook(@Req() req: Request, @Body() body: any) {
    const incomingToken = req.headers.get('x-callback-token');
    const verificatorToken = this.configService.getOrThrow(
      'XENDIT_WEBHOOK_VERIFICATION_TOKEN'
    );

    if (!incomingToken)
      throw new ForbiddenException('Callback token not present');

    if (incomingToken !== verificatorToken)
      throw new ForbiddenException('You are not Xendit');

    if (body.data.id) {
      if (body.event == 'payment.succeeded')
        this.paymentsService.updateByReferenceId(body.data.id, {
          status: PaymentStatus.SUCCEEDED,
        });
      else if (body.event == 'payment.failed')
        this.paymentsService.updateByReferenceId(body.data.id, {
          status: PaymentStatus.FAILED,
          failedReason: body.data.failure_code ?? '',
        });
      else if (body.event == 'payment_method.expired')
        this.paymentsService.updateByReferenceId(body.data.id, {
          status: PaymentStatus.EXPIRED,
        });
      else if (body.event == 'payment_method.failed')
        this.paymentsService.updateByReferenceId(body.data.id, {
          status: PaymentStatus.FAILED,
          failedReason: body.data.failure_code ?? '',
        });
    }
  }

  @Post()
  @Private({ permissions: ['payments/create'] })
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.create(createPaymentDto);
  }

  @Get()
  @Private({ permissions: ['payments/find-all'] })
  findAll(@Query() query: BrowseQuery) {
    const q = transformBrowseQuery(query);
    return this.paymentsService.findAll(q);
  }

  @Get(':id')
  @Private({ permissions: ['payments/find-one'] })
  findOne(@ParamUUID('id') id: string) {
    return this.paymentsService.findOne(id);
  }

  @Patch(':id')
  @Private({ permissions: ['payments/update'] })
  update(
    @ParamUUID('id') id: string,
    @Body() updatePaymentDto: UpdatePaymentDto
  ) {
    return this.paymentsService.update(id, updatePaymentDto);
  }

  @Delete(':id/soft')
  @Private({ permissions: ['payments/soft-delete'] })
  softDelete(@ParamUUID('id') id: string) {
    return this.paymentsService.softDelete(id);
  }

  @Patch(':id/restore')
  @Private({ permissions: ['payments/restore'] })
  restore(@ParamUUID('id') id: string) {
    return this.paymentsService.restore(id);
  }

  @Delete(':id/hard')
  @Private({ permissions: ['payments/hard-delete'] })
  hardDelete(@ParamUUID('id') id: string) {
    return this.paymentsService.hardDelete(id);
  }
}
