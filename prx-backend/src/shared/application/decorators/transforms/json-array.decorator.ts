import { Transform } from 'class-transformer';
import { ClassConstructor, plainToInstance } from 'class-transformer';

export function JsonArray<T>(dto: ClassConstructor<T>) {
  return Transform(({ value }) => {
    if (!value) {
      return undefined;
    }

    if (Array.isArray(value)) {
      return value.map((item) => plainToInstance(dto, item));
    }

    if (typeof value !== 'string') {
      return value;
    }

    const parsedValue = JSON.parse(value);

    if (!Array.isArray(parsedValue)) {
      return parsedValue;
    }

    return parsedValue.map((item) => plainToInstance(dto, item));
  });
}
