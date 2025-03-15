import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ErrorResponse } from 'src/types/response.type';

@Catch()
export class CatchAllFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: Error, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    let httpCode =
        exception instanceof HttpException
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR,
      message =
        httpCode == HttpStatus.INTERNAL_SERVER_ERROR &&
        process.env.NODE_ENV != 'development'
          ? 'Internal server error'
          : (exception?.message ?? 'Unknown error'),
      stack =
        process.env.NODE_ENV == 'development'
          ? exception?.stack?.split('\n')
          : undefined;

    const response: ErrorResponse = {
      status: false,
      message,
      stack,
    };

    httpAdapter.reply(ctx.getResponse(), response, httpCode);
  }
}
