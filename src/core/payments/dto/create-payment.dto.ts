import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import {
  PaymentCountryCode,
  PaymentCurrency,
  PaymentStatus,
} from '../entities/payment.entity';
import { ExistsInDatabase } from 'src/validators/exist-in-database.validator';
import { User } from 'src/core/users/entities/user.entity';

export class CreatePaymentDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsEnum(PaymentCurrency)
  @IsNotEmpty()
  currency: PaymentCurrency;

  @IsEnum(PaymentCountryCode)
  @IsNotEmpty()
  countryCode: PaymentCountryCode;

  @IsEnum(PaymentStatus)
  @IsNotEmpty()
  status: PaymentStatus = PaymentStatus.PENDING;

  @IsString()
  @IsOptional()
  method?: string;

  @IsString()
  @IsOptional()
  channel?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  failedReason?: string;

  @ExistsInDatabase(User, 'id')
  @IsUUID()
  @IsString()
  @IsOptional()
  userId?: string;
}
