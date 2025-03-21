import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  ValidateIf,
} from 'class-validator';
import {
  PaymentCountryCode,
  PaymentCurrency,
  PaymentMethod,
  PaymentStatus,
} from '../entities/payment.entity';
import { ExistsInDatabase } from 'src/validators/exist-in-database.validator';
import { User } from 'src/core/users/entities/user.entity';
import { Transform } from 'class-transformer';

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
  status: PaymentStatus;

  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  method: PaymentMethod;

  @IsString()
  @IsNotEmpty()
  channel: string;

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

  @Transform(({ value }) => (value ? new Date(value) : null))
  @IsDate()
  @IsOptional()
  expiredAt?: Date;

  @ValidateIf((o) => o.method == PaymentMethod.EWALLET)
  @IsUrl()
  @IsString()
  @IsNotEmpty()
  succeedCallbackUrl?: string;

  @ValidateIf((o) => o.method == PaymentMethod.EWALLET)
  @IsUrl()
  @IsString()
  @IsNotEmpty()
  failedCallbackUrl?: string;
}
