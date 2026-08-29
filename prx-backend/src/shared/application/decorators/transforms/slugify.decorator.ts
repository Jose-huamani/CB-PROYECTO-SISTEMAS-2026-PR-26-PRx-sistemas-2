import { Transform } from 'class-transformer';

export function Slugify() {
  return Transform(({ value }) => {
    if (typeof value !== 'string') {
      return value;
    }

    return value
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  });
}
