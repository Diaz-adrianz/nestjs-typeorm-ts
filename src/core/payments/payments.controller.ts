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
  NotFoundException,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { ParamUUID } from 'src/decorators/param.decorator';
import { Private } from 'src/decorators/private.decorator';
import { fillQuery, transformBrowseQuery } from 'src/utils/browse-query.utils';
import { BrowseQuery } from 'src/base/dto.base';
import { ConfigService } from '@nestjs/config';
import { PaymentStatus } from './entities/payment.entity';
import { User } from 'src/decorators/user.decorator';
import { ReqUser } from 'src/types/jwt.type';

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
        return this.paymentsService.updateByReferenceId(body.data.id, {
          status: PaymentStatus.SUCCEEDED,
        });
      else if (body.event == 'payment.failed')
        return this.paymentsService.updateByReferenceId(body.data.id, {
          status: PaymentStatus.FAILED,
          failedReason: body.data.failure_code ?? '',
        });
      else if (body.event == 'payment_method.expired')
        return this.paymentsService.updateByReferenceId(body.data.id, {
          status: PaymentStatus.EXPIRED,
        });
      else if (body.event == 'payment_method.failed')
        return this.paymentsService.updateByReferenceId(body.data.id, {
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
  @Private({ permissions: ['payments/find-all'], strict: false })
  findAll(@User() user: ReqUser, @Query() query: BrowseQuery) {
    const q = transformBrowseQuery(query);
    if (!user.hasPermission) fillQuery(q.where, 'user.id', user.id);
    return this.paymentsService.findAll(q);
  }

  @Get(':id')
  @Private({ permissions: ['payments/find-one'], strict: false })
  async findOne(@User() user: ReqUser, @ParamUUID('id') id: string) {
    const data = await this.paymentsService.findOne(id);
    if (!user.hasPermission && (!data.user || data.user.id != user.id))
      throw new NotFoundException();
    return data;
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
