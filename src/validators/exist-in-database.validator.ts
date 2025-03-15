import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  isUUID,
} from 'class-validator';
import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ async: true })
@Injectable()
export class ExistsInDatabaseConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly dataSource: DataSource) {}

  async validate(value: any, args: ValidationArguments) {
    if (!isUUID(value)) return false;
    const [entityClass, column = 'id'] = args.constraints;
    const repository = this.dataSource.getRepository(entityClass);

    const count = await repository.count({ where: { [column]: value } });
    return count > 0;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} does not exist in ${args.constraints[0].name}`;
  }
}

export function ExistsInDatabase(
  entity: any,
  column?: string,
  validationOptions?: ValidationOptions
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'ExistsInDatabase',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [entity, column],
      options: validationOptions,
      validator: ExistsInDatabaseConstraint,
    });
  };
}
