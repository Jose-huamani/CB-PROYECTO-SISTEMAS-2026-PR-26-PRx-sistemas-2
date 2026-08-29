import { Transform } from 'class-transformer';

export function UniqueByProperties(...properties: string[]) {
  return Transform(({ value }) => {
    if (!Array.isArray(value)) {
      return value;
    }

    if (!properties.length) {
      return value;
    }

    const uniqueValues = new Set<string>();

    return value.filter((item) => {
      if (!item || typeof item !== 'object') {
        return true;
      }

      const key = properties
        .map((property) => {
          const propertyValue = (item as Record<string, unknown>)[property];

          if (propertyValue === null || propertyValue === undefined) {
            return '';
          }

          return String(propertyValue);
        })
        .join('|');

      if (uniqueValues.has(key)) {
        return false;
      }

      uniqueValues.add(key);
      return true;
    });
  });
}
