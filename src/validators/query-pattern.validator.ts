import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

function isValidFormat(str: string): boolean {
  const pairs = str.split('~');

  for (const pair of pairs) {
    if (!/^[a-zA-Z0-9_]+:[^\~]+$/.test(pair)) {
      return false;
    }
  }

  return true;
}

export function QueryPattern(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'SearchPattern',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return typeof value === 'string' && isValidFormat(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be in the format "<field>:<value>, and use (~) as separator for multiple field"`;
        },
      },
    });
  };
}
