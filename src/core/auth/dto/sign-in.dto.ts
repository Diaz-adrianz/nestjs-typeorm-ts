import {
  IsEmail,
  IsJWT,
  IsNotEmpty,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IsMatch } from 'src/validators/is-match.validator';

export class SignInEmail {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @MinLength(8)
  @MaxLength(16)
  @IsNotEmpty()
  password: string;
}

export class SignInGoogle {
  @IsString()
  g_token: string;
}

export class RefreshToken {
  @IsString()
  @IsNotEmpty()
  refresh: string;
}

export class ForgotPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class ResetPasswordDto {
  @Length(6)
  @IsString()
  @IsNotEmpty()
  otp: string;

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
