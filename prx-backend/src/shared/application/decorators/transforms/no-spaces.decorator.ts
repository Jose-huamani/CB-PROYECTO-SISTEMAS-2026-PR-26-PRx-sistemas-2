import { Transform } from 'class-transformer';

export function NoSpaces() {
  return Transform(({ value }) => {
    if (typeof value !== 'string') {
      return value;
    }

    return value.replace(/\s+/g, '');
  });
}
