import { HttpException, HttpStatus } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export class ClassValidatorException extends HttpException {
  invalids: ValidationError[];

  constructor(invalids: ValidationError[]) {
    super('Validation error', HttpStatus.UNPROCESSABLE_ENTITY);
    this.invalids = invalids;
  }
}
