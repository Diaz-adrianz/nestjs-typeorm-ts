import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { LoggerService } from 'src/lib/logger/logger.service';
import { ErrorResponse } from 'src/types/response.type';

@Catch()
export class CatchAllFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly loggerService: LoggerService
  ) {}

  catch(exception: Error, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();
    const isProd = process.env.NODE_ENV !== 'development';

    const httpCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      isProd && httpCode === HttpStatus.INTERNAL_SERVER_ERROR
        ? 'Internal server error'
        : (exception?.message ?? 'Unknown error');

    const stack = isProd ? undefined : exception?.stack?.split('\n');

    if (httpCode === HttpStatus.INTERNAL_SERVER_ERROR)
      this.loggerService.error(exception);

    const response: ErrorResponse = {
      status: false,
      message,
      stack,
    };

    httpAdapter.reply(ctx.getResponse(), response, httpCode);
  }
}
