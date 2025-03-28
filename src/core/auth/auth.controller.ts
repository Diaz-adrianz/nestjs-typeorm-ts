import { Body, Controller, Delete, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RefreshToken, SignInEmail } from './dto/sign-in.dto';
import { User } from 'src/decorators/user.decorator';
import { ReqUser } from 'src/types/jwt.type';
import { JwtGuard } from './guards/jwt.guard';
import {
  SendEmailVerification,
  SignUpEmail,
  VerifyEmail,
} from './dto/sign-up.dto';
import { ResponseMessage } from 'src/decorators/response-message.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin-email')
  signInEmail(@Body() body: SignInEmail) {
    return this.authService.signInEmail(body);
  }

  @Post('signup-email')
  @ResponseMessage('Check your inbox to verify access')
  signUpEmail(@Body() body: SignUpEmail) {
    return this.authService.signUpEmail(body);
  }

  @Post('send-email-verification')
  @ResponseMessage('Check your inbox to verify access')
  sendEmailVerification(@Body() body: SendEmailVerification) {
    return this.authService.sendEmailVerification(body.email);
  }

  @Post('verify-email')
  @ResponseMessage('Email verified')
  verifyEmail(@Body() body: VerifyEmail) {
    return this.authService.verifyEmail(body);
  }

  @Post('refresh-token')
  refreshToken(@Body() body: RefreshToken) {
    return this.authService.refreshToken(body);
  }

  @Delete('signOut')
  @UseGuards(JwtGuard)
  signOut(@User() user: ReqUser) {
    return this.authService.signOut(user.id);
  }
}
