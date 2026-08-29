import { HttpErrorResponse } from '@angular/common/http';

import { ApiResponseModel } from '@shared/models/api-response.model';

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isNonEmptyStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(isNonEmptyString);
}

export function getApiNotificationMessage<T>(
  response: ApiResponseModel<T>,
  fallbackMessage: string,
): string | string[] {
  const message = response.message;

  if (isNonEmptyString(message)) {
    return message;
  }

  if (isNonEmptyStringArray(message) && message.length > 0) {
    return message;
  }

  return fallbackMessage;
}

export function getApiErrorNotificationMessage(
  error: HttpErrorResponse,
  fallbackMessage: string,
): string | string[] {
  const message = error.error?.message;

  if (isNonEmptyString(message)) {
    return message;
  }

  if (isNonEmptyStringArray(message) && message.length > 0) {
    return message;
  }

  return fallbackMessage;
}
