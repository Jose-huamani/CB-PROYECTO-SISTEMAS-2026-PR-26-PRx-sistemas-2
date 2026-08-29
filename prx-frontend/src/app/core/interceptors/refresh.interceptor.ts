import { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';

import { AuthRefreshService } from '@core/services/auth-refresh.service';
import { TokenService } from '@core/services/token.service';
import { AuthFacade } from '@features/auth/application/facades/auth.facade';
import { AUTH_API_CONFIG } from '@features/auth/infrastructure/config/auth-api.config';

function isRefreshExcludedRequest(url: string): boolean {
  const excludedEndpoints = [AUTH_API_CONFIG.endpoints.login, AUTH_API_CONFIG.endpoints.refresh];

  return excludedEndpoints.some((endpoint) => url.includes(`${AUTH_API_CONFIG.base}${endpoint}`));
}

function isLogoutRequest(url: string): boolean {
  return url.includes(`${AUTH_API_CONFIG.base}${AUTH_API_CONFIG.endpoints.logout}`);
}

function patchLogoutBody<TBody>(
  request: HttpRequest<TBody>,
  newRefreshToken: string,
): TBody | { refreshToken: string } {
  if (!isLogoutRequest(request.url) || !request.body) {
    return request.body as TBody;
  }

  return {
    ...(request.body as object),
    refreshToken: newRefreshToken,
  } as TBody | { refreshToken: string };
}

export const refreshInterceptor: HttpInterceptorFn = (request, next) => {
  const tokenService = inject(TokenService);
  const authRefreshService = inject(AuthRefreshService);
  const authFacade = inject(AuthFacade);

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      const shouldTryRefresh = error.status === 401 && !isRefreshExcludedRequest(request.url);

      if (!shouldTryRefresh) {
        return throwError(() => error);
      }

      if (!tokenService.hasRefreshToken()) {
        authFacade.clearSession();
        authRefreshService.clearRefreshState();

        return throwError(() => error);
      }

      return authRefreshService.refreshToken().pipe(
        switchMap((response) => {
          const auth = response.data;

          if (!auth) {
            authFacade.clearSession();
            authRefreshService.clearRefreshState();

            return throwError(() => error);
          }

          const requestWithNewToken = request.clone({
            setHeaders: {
              Authorization: `Bearer ${auth.accessToken}`,
            },
            body: patchLogoutBody(request, auth.refreshToken),
          });

          return next(requestWithNewToken);
        }),
        catchError((refreshError) => {
          authFacade.clearSession();
          authRefreshService.clearRefreshState();

          return throwError(() => refreshError);
        }),
      );
    }),
  );
};
