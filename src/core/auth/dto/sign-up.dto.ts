import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IsMatch } from 'src/validators/is-match.validator';

export class SignUpEmail {
  @MaxLength(30)
  @MinLength(4)
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @MaxLength(16)
  @MinLength(8)
  @IsNotEmpty()
  password: string;

  @IsMatch('password')
  @MaxLength(16)
  @MinLength(8)
  @IsNotEmpty()
  matchPassword: string;
}

export class SendEmailVerification {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;
}
