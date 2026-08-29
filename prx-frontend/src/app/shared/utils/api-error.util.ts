import { HttpErrorResponse } from '@angular/common/http';

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export function extractApiErrorMessages(
  error: HttpErrorResponse,
  fallbackMessage: string,
): string[] {
  const rawMessage = error.error?.message;

  if (!rawMessage) {
    return [fallbackMessage];
  }

  if (Array.isArray(rawMessage)) {
    const validMessages = rawMessage.filter(isNonEmptyString);

    return validMessages.length > 0 ? validMessages : [fallbackMessage];
  }

  if (isNonEmptyString(rawMessage)) {
    return [rawMessage];
  }

  return [fallbackMessage];
}
