/**
 * Convierte un valor string en número.
 * Si el valor es nulo, vacío o no se puede parsear,
 * devuelve el número de fallback.
 */

export function toNumberOrDefault(
  value: string | undefined,
  fallback: number,
): number {
  if (value == null || value.trim() === '') {
    return fallback;
  }

  const parsed = Number(value);

  if (Number.isNaN(parsed)) {
    return fallback;
  }

  return parsed;
}
