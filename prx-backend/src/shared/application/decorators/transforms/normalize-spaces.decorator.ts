import { Transform } from 'class-transformer';

export function NormalizeSpaces() {
  return Transform(({ value }) => {
    if (typeof value !== 'string') {
      return value;
    }

    return value.trim().replace(/\s+/g, ' ');
  });
}
