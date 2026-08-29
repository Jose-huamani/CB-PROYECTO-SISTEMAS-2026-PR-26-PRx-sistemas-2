import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { NotificationService } from '@core/services/notification.service';
import { AuthFacade } from '@features/auth/application/facades/auth.facade';
import { AUTH_API_CONFIG } from '@features/auth/infrastructure/config/auth-api.config';
import { APP_MESSAGES } from '@shared/constants/app-messages.constants';
import { getApiErrorNotificationMessage } from '@shared/utils/api-notification.util';

function isExcludedRequest(url: string): boolean {
  const excludedEndpoints = [AUTH_API_CONFIG.endpoints.login, AUTH_API_CONFIG.endpoints.refresh];

  return excludedEndpoints.some((endpoint) => url.includes(`${AUTH_API_CONFIG.base}${endpoint}`));
}

export const errorInterceptor: HttpInterceptorFn = (request, next) => {
  const notificationService = inject(NotificationService);
  const authFacade = inject(AuthFacade);

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      const isUnauthorized = error.status === 401 && !isExcludedRequest(request.url);

      if (isUnauthorized) {
        authFacade.clearSession();
        notificationService.error('Sesión', APP_MESSAGES.SESSION.EXPIRED);

        return throwError(() => error);
      }

      if (error.status === 0 || error.status >= 500) {
        notificationService.error(
          'Error',
          getApiErrorNotificationMessage(error, APP_MESSAGES.GENERAL.UNEXPECTED_ERROR),
        );
      }

      return throwError(() => error);
    }),
  );
};
