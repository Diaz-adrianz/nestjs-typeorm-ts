import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { PaymentStatus } from '../entities/payment.entity';
import { ExistsInDatabase } from 'src/validators/exist-in-database.validator';
import { User } from 'src/core/users/entities/user.entity';

export class CreatePaymentDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsString()
  @IsNotEmpty()
  countryCode: string;

  @IsEnum(PaymentStatus)
  @IsNotEmpty()
  status: PaymentStatus = PaymentStatus.PENDING;

  @IsString()
  @IsOptional()
  method?: boolean;

  @IsString()
  @IsOptional()
  channel?: boolean;

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
