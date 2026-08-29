import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsHexColor(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isHexColor',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown): boolean {
          if (typeof value !== 'string') {
            return false;
          }

          return /^[0-9a-fA-F]{6}$/.test(value);
        },
        defaultMessage(args: ValidationArguments): string {
          return `${args.property} debe ser un color hexadecimal válido de 6 caracteres.`;
        },
      },
    });
  };
}
