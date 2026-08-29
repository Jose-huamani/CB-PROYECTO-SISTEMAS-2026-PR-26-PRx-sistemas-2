import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '@core/services/token.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const tokenService = inject(TokenService);
  const accessToken = tokenService.accessToken();
  const hasAuthorizationHeader = request.headers.has('Authorization');

  if (!accessToken || hasAuthorizationHeader) {
    return next(request);
  }

  const requestWithAuth = request.clone({
    setHeaders: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return next(requestWithAuth);
};
