import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ErrorResponse } from 'src/types/response.type';
import { EntityNotFoundError, QueryFailedError, TypeORMError } from 'typeorm';

@Catch(TypeORMError)
export class TypeormFilter<T> implements ExceptionFilter {
  catch(exception: TypeORMError, host: ArgumentsHost) {
    const IS_DEV = process.env.NODE_ENV == 'development';

    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const stack = IS_DEV ? exception?.stack?.split('\n') : undefined;

    let status = HttpStatus.INTERNAL_SERVER_ERROR,
      message = IS_DEV ? exception.message : 'Database error';

    if (exception.message.includes('violates foreign key')) {
      status = HttpStatus.UNPROCESSABLE_ENTITY;
      message = 'The referenced data does not exist or has been deleted.';
    }

    if (
      exception instanceof QueryFailedError &&
      exception.message.includes(
        'duplicate key value violates unique constraint'
      )
    ) {
      status = HttpStatus.UNPROCESSABLE_ENTITY;
      message = 'Duplicate entry detected';
      try {
        const match = (exception as any)?.detail.match(
          /Key \((\w+)\)=\((.*?)\) already exist/i
        );
        if (match) {
          const [_, field, value] = match;
          message = `${field.charAt(0).toUpperCase() + field.slice(1)} '${value}' already exists.`;
        }
      } catch {}
    }

    if (exception instanceof EntityNotFoundError) {
      status = HttpStatus.NOT_FOUND;
      message = 'Entry not found';
      try {
        const match = exception.message.match(
          /Could not find any entity of type "(.*?)"/
        );
        if (match) {
          message = `${match[1]} not found.`;
        }
      } catch {}
    }

    const response: ErrorResponse = {
      status: false,
      message,
      stack,
    };

    res.status(status).json(response);
  }
}
