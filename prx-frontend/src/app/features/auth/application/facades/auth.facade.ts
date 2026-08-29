import { Injectable, inject } from '@angular/core';
import { Observable, catchError, finalize, tap, throwError } from 'rxjs';

import { TokenService } from '@core/services/token.service';
import { AuthApi } from '@features/auth/infrastructure/api/auth.api';
import { AuthStore } from '@features/auth/infrastructure/store/auth.store';
import { AuthModel } from '@features/auth/domain/models/auth.model';
import { ChangePasswordRequest } from '@features/auth/domain/requests/change-password.request';
import { ConfirmRegisterRequest } from '@features/auth/domain/requests/confirm-register.request';
import { ForgotPasswordRequest } from '@features/auth/domain/requests/forgot-password.request';
import { LoginRequest } from '@features/auth/domain/requests/login.request';
import { LogoutRequest } from '@features/auth/domain/requests/logout.request';
import { RefreshRequest } from '@features/auth/domain/requests/refresh.request';
import { RegisterRequestData } from '@features/auth/domain/requests/register-request.request';
import { ResendCodeRequest } from '@features/auth/domain/requests/resend-code.request';
import { ResetPasswordRequest } from '@features/auth/domain/requests/reset-password.request';
import { ApiResponseModel } from '@shared/models/api-response.model';
import { CurrentUserModel } from '@shared/models/current-user.model';
import { resolvePublicStorageUrl } from '@shared/utils/storage-url.util';

@Injectable({
  providedIn: 'root',
})
export class AuthFacade {
  private readonly authApi = inject(AuthApi);
  private readonly authStore = inject(AuthStore);
  private readonly tokenService = inject(TokenService);

  readonly currentUser = this.authStore.currentUser;
  readonly isAuthenticated = this.authStore.isAuthenticated;
  readonly loading = this.authStore.loading;

  login(data: LoginRequest): Observable<ApiResponseModel<AuthModel>> {
    return this.executeWithLoading(
      this.authApi.login(data).pipe(
        tap((response) => {
          const auth = response.data;

          if (!auth) {
            return;
          }

          this.tokenService.setTokens(auth.accessToken, auth.refreshToken);
          this.authStore.setCurrentUser(this.mapCurrentUser(auth.user));
        }),
      ),
    );
  }

  registerRequest(data: RegisterRequestData): Observable<ApiResponseModel<void>> {
    return this.executeWithLoading(this.authApi.registerRequest(data));
  }

  confirmRegister(data: ConfirmRegisterRequest): Observable<ApiResponseModel<void>> {
    return this.executeWithLoading(this.authApi.confirmRegister(data));
  }

  resendVerificationCode(data: ResendCodeRequest): Observable<ApiResponseModel<void>> {
    return this.executeWithLoading(this.authApi.resendVerificationCode(data));
  }

  forgotPassword(data: ForgotPasswordRequest): Observable<ApiResponseModel<void>> {
    return this.executeWithLoading(this.authApi.forgotPassword(data));
  }

  resetPassword(data: ResetPasswordRequest): Observable<ApiResponseModel<void>> {
    return this.executeWithLoading(this.authApi.resetPassword(data));
  }

  changePassword(data: ChangePasswordRequest): Observable<ApiResponseModel<void>> {
    return this.executeWithLoading(this.authApi.changePassword(data));
  }

  refresh(data: RefreshRequest): Observable<ApiResponseModel<AuthModel>> {
    return this.executeWithLoading(
      this.authApi.refresh(data).pipe(
        tap((response) => {
          const auth = response.data;

          if (!auth) {
            return;
          }

          this.tokenService.setTokens(auth.accessToken, auth.refreshToken);
          this.authStore.setCurrentUser(this.mapCurrentUser(auth.user));
        }),
      ),
    );
  }

  loadCurrentUser(): Observable<ApiResponseModel<CurrentUserModel>> {
    return this.executeWithLoading(
      this.authApi.me().pipe(
        tap((response) => {
          const user = response.data;

          if (!user) {
            return;
          }

          this.authStore.setCurrentUser(this.mapCurrentUser(user));
        }),
      ),
    );
  }

  restoreSession(): Observable<ApiResponseModel<CurrentUserModel>> {
    return this.executeWithLoading(
      this.authApi.me().pipe(
        tap((response) => {
          const user = response.data;

          if (!user) {
            return;
          }

          this.authStore.setCurrentUser(this.mapCurrentUser(user));
        }),
        catchError((error) => {
          this.clearSession();
          return throwError(() => error);
        }),
      ),
    );
  }

  logout(data: LogoutRequest): Observable<ApiResponseModel<void>> {
    return this.executeWithLoading(
      this.authApi.logout(data).pipe(
        tap(() => {
          this.clearSession();
        }),
      ),
    );
  }

  updateAuthenticatedUser(user: CurrentUserModel): void {
    this.authStore.setCurrentUser(this.mapCurrentUser(user));
  }

  clearSession(): void {
    this.tokenService.clearTokens();
    this.authStore.clear();
  }

  private mapCurrentUser(user: CurrentUserModel): CurrentUserModel {
    return {
      ...user,
      avatarUrl: resolvePublicStorageUrl(user.avatarUrl),
    };
  }

  private executeWithLoading<T>(source$: Observable<T>): Observable<T> {
    this.authStore.setLoading(true);

    return source$.pipe(
      finalize(() => {
        this.authStore.setLoading(false);
      }),
    );
  }
}
