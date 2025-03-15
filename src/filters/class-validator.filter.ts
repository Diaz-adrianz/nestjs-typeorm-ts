import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { Response } from 'express';
import { ClassValidatorException } from 'src/exceptions/class-validator.exception';
import { ErrorResponse } from 'src/types/response.type';

export type ClassValidatorError = Record<
  string,
  { children?: ClassValidatorError; errors: string[] }
>;

@Catch(ClassValidatorException)
export class ClassValidatorFilter implements ExceptionFilter {
  catch(exception: ClassValidatorException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const response: ErrorResponse<ClassValidatorError> = {
      status: false,
      message: exception.message,
      data: this.transform(exception.invalids),
    };

    res.status(status).json(response);
  }

  transform(errors: ValidationError[]): ClassValidatorError {
    return errors.reduce<ClassValidatorError>((acc, error) => {
      acc[error.property] = {
        errors: Object.values(error.constraints || []),
      };
      if (error.children?.length)
        acc[error.property].children = this.transform(error.children);
      return acc;
    }, {});
  }
}
