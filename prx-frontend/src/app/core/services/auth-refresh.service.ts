import { Injectable, inject } from '@angular/core';
import { Observable, finalize, shareReplay, tap, throwError } from 'rxjs';

import { TokenService } from '@core/services/token.service';
import { AuthFacade } from '@features/auth/application/facades/auth.facade';
import { AuthModel } from '@features/auth/domain/models/auth.model';
import { AuthApi } from '@features/auth/infrastructure/api/auth.api';
import { ApiResponseModel } from '@shared/models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class AuthRefreshService {
  private readonly authApi = inject(AuthApi);
  private readonly authFacade = inject(AuthFacade);
  private readonly tokenService = inject(TokenService);

  private refreshRequest$: Observable<ApiResponseModel<AuthModel>> | null = null;

  refreshToken(): Observable<ApiResponseModel<AuthModel>> {
    const refreshToken = this.tokenService.refreshToken();

    if (!refreshToken) {
      this.authFacade.clearSession();

      return throwError(() => new Error('AUTH_NO_REFRESH_TOKEN'));
    }

    if (this.refreshRequest$) {
      return this.refreshRequest$;
    }

    this.refreshRequest$ = this.authApi.refresh({ refreshToken }).pipe(
      tap((response) => {
        const auth = response.data;

        if (!auth) {
          return;
        }

        this.tokenService.setTokens(auth.accessToken, auth.refreshToken);
        this.authFacade.updateAuthenticatedUser(auth.user);
      }),
      shareReplay(1),
      finalize(() => {
        this.refreshRequest$ = null;
      }),
    );

    return this.refreshRequest$;
  }

  clearRefreshState(): void {
    this.refreshRequest$ = null;
  }
}
