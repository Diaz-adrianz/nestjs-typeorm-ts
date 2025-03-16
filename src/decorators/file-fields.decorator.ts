import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

export function FileFields(fields: Record<string, number>) {
  return applyDecorators(
    UseInterceptors(
      FileFieldsInterceptor(
        Object.entries(fields).map(([name, maxCount]) => ({
          name,
          maxCount,
        }))
      )
    )
  );
}
