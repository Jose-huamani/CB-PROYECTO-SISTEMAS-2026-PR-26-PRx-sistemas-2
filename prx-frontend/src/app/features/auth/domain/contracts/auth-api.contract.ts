import { Observable } from 'rxjs';

import { AuthModel } from '@features/auth/domain/models/auth.model';
import { LoginRequest } from '@features/auth/domain/requests/login.request';
import { RegisterRequestData } from '@features/auth/domain/requests/register-request.request';
import { ConfirmRegisterRequest } from '@features/auth/domain/requests/confirm-register.request';
import { ResendCodeRequest } from '@features/auth/domain/requests/resend-code.request';
import { ForgotPasswordRequest } from '@features/auth/domain/requests/forgot-password.request';
import { ResetPasswordRequest } from '@features/auth/domain/requests/reset-password.request';
import { ChangePasswordRequest } from '@features/auth/domain/requests/change-password.request';
import { RefreshRequest } from '@features/auth/domain/requests/refresh.request';
import { LogoutRequest } from '@features/auth/domain/requests/logout.request';
import { CurrentUserModel } from '@shared/models/current-user.model';
import { ApiResponseModel } from '@shared/models/api-response.model';

export abstract class AuthApiContract {
  abstract login(data: LoginRequest): Observable<ApiResponseModel<AuthModel>>;
  abstract registerRequest(data: RegisterRequestData): Observable<ApiResponseModel<void>>;
  abstract confirmRegister(data: ConfirmRegisterRequest): Observable<ApiResponseModel<void>>;
  abstract resendVerificationCode(data: ResendCodeRequest): Observable<ApiResponseModel<void>>;
  abstract forgotPassword(data: ForgotPasswordRequest): Observable<ApiResponseModel<void>>;
  abstract resetPassword(data: ResetPasswordRequest): Observable<ApiResponseModel<void>>;
  abstract changePassword(data: ChangePasswordRequest): Observable<ApiResponseModel<void>>;
  abstract refresh(data: RefreshRequest): Observable<ApiResponseModel<AuthModel>>;
  abstract logout(data: LogoutRequest): Observable<ApiResponseModel<void>>;
  abstract me(): Observable<ApiResponseModel<CurrentUserModel>>;
}
