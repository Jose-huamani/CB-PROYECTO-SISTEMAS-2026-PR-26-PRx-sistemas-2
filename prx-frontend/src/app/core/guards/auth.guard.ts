import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { NotificationService } from '@core/services/notification.service';
import { TokenService } from '@core/services/token.service';
import { AUTH_MESSAGES } from '@shared/constants/auth-messages.constants';

export const authGuard: CanActivateFn = () => {
  const tokenService = inject(TokenService);
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  if (tokenService.hasAccessToken()) {
    return true;
  }

  notificationService.warn(
    AUTH_MESSAGES.SESSION_REQUIRED.TITLE,
    AUTH_MESSAGES.SESSION_REQUIRED.DESCRIPTION,
  );

  return router.createUrlTree(['/auth/login']);
};
