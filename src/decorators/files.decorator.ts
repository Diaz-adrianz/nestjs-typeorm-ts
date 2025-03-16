import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import {
  FilesValidatorPipe,
  FileValidationOptions,
} from 'src/pipes/files-validator.pipe';

export const Files = createParamDecorator(
  (validators: Record<string, FileValidationOptions>, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return new FilesValidatorPipe(validators).transform(req.files);
  }
);
