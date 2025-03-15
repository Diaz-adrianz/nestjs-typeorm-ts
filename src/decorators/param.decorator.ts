import {
  createParamDecorator,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { ParseUUIDPipe } from '@nestjs/common';

export const ParamUUID = createParamDecorator(
  async (key: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const value = request.params[key];

    try {
      return await new ParseUUIDPipe().transform(value, {
        type: 'param',
        metatype: String,
      });
    } catch {
      throw new BadRequestException(
        `Invalid UUID format for parameter "${key}"`
      );
    }
  }
);
