import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { ParamUUID } from 'src/decorators/param.decorator';
import { Private } from 'src/decorators/private.decorator';
import { transformBrowseQuery } from 'src/utils/browse-query.utils';
import { BrowseQuery } from 'src/base/dto.base';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

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
