import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  classToPlain,
  instanceToPlain,
  plainToInstance,
} from 'class-transformer';
import { map, NotFoundError, Observable } from 'rxjs';
import { BrowseQuery } from 'src/base/dto.base';
import { RESPONSE_MESSAGE_METADATA } from 'src/decorators/response-message.decorator';
import { SuccessResponse } from 'src/types/response.type';
import { DeleteResult, UpdateResult } from 'typeorm';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, SuccessResponse<T>>
{
  constructor(private reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<SuccessResponse<T>> {
    return next
      .handle()
      .pipe(map((res: unknown) => this.responseHandler(res, context)));
  }

  responseHandler(res: any, context: ExecutionContext): SuccessResponse<T> {
    const req = context.switchToHttp().getRequest();

    let message =
        this.reflector.get<string>(
          RESPONSE_MESSAGE_METADATA,
          context.getHandler()
        ) || 'success',
      data: any = instanceToPlain(res);

    if (
      Array.isArray(res) &&
      res.length == 2 &&
      Array.isArray(res[0]) &&
      typeof res[1] == 'number'
    ) {
      const q = plainToInstance(BrowseQuery, req.query ?? {});

      if (q.paginate == 'true') {
        const count = res[1] ?? 0;

        data = {
          items: instanceToPlain(res),
          page: q.page,
          limit: +q.limit,
          total_items: count,
          total_pages: Math.ceil(count / +q.limit) || 1,
        };
      } else data = instanceToPlain(res);
    }

    if (res instanceof DeleteResult || res instanceof UpdateResult) {
      if (!res.affected) throw new NotFoundException('Entry not found');
    }

    return {
      status: true,
      message,
      data,
    };
  }
}
