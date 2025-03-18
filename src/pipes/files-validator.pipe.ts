import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { ClassValidatorException } from 'src/exceptions/class-validator.exception';
import { bytesToMB } from 'src/utils/converter.util';

export const allowedMimeTypes = {
  'image/jpg': 'image/jpg',
  'image/jpeg': 'image/jpeg',
  'image/png': 'image/png',
  'application/pdf': 'application/pdf',
} as const;

export interface FileValidationOptions {
  mimeTypes: (keyof typeof allowedMimeTypes)[];
  maxBytes: number;
  count?: number;
}

export type ReqFile = Express.Multer.File;

@Injectable()
export class FilesValidatorPipe implements PipeTransform {
  constructor(
    private readonly validators: Record<string, FileValidationOptions>
  ) {}

  transform(files: Record<string, ReqFile[]>): Record<string, ReqFile[]> {
    const fieldErrors: ValidationError[] = [];

    const pushError = (
      field: string,
      errorName: string,
      errorMessage: string
    ) => {
      const parts = field.split('.');
      let current: ValidationError[] = fieldErrors;

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        let fieldError = current.find((fe) => fe.property === part);

        if (!fieldError) {
          fieldError = { property: part, constraints: {} };
          current.push(fieldError);
        }

        if (i === parts.length - 1) {
          fieldError.constraints![errorName] = errorMessage;
        } else {
          if (!fieldError.children) {
            fieldError.children = [];
          }
          current = fieldError.children;
        }
      }
    };

    for (const field in files) {
      if (!this.validators[field]) continue;
      const { mimeTypes, maxBytes, count } = this.validators[field];

      if (count && files[field].length != count)
        pushError(field, 'count', `Exactly ${count} file(s) is required.`);

      files[field].forEach((file, i) => {
        if (!(mimeTypes as string[]).includes(file.mimetype)) {
          pushError(
            field + '.' + i,
            'mimeType',
            `Invalid file type. Allowed: ${mimeTypes.join(', ')}`
          );
        }

        if (file.size > maxBytes) {
          pushError(
            field + '.' + i,
            'maxBytes',
            `File size exceeds ${bytesToMB(maxBytes)} MB`
          );
        }
      });
    }

    if (fieldErrors.length > 0) throw new ClassValidatorException(fieldErrors);

    return files;
  }
}
