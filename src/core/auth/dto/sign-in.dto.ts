import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

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
