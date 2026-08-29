import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { ButtonModule } from 'primeng/button';
import { finalize } from 'rxjs';

import { NotificationService } from '@core/services/notification.service';
import { AuthFacade } from '@features/auth/application/facades/auth.facade';
import { buildResetPasswordFormFields } from '@features/auth/application/forms/reset-password.form';
import { AUTH_MESSAGES } from '@features/auth/constants/auth-messages.constants';
import { ResetPasswordRequest } from '@features/auth/domain/requests/reset-password.request';
import { AUTH_CONSTANTS } from '@shared/constants/auth.constants';
import { UI_MESSAGES } from '@shared/constants/ui-messages.constants';
import { NotificationMessage } from '@shared/types/notification-message.type';
import {
  getApiErrorNotificationMessage,
  getApiNotificationMessage,
} from '@shared/utils/api-notification.util';

@Component({
  selector: 'app-reset-password-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormlyModule, ButtonModule, RouterLink],
  templateUrl: './reset-password-page.component.html',
  styleUrl: './reset-password-page.component.scss',
})
export class ResetPasswordPageComponent {
  private readonly authFacade = inject(AuthFacade);
  private readonly notificationService = inject(NotificationService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly form = new FormGroup({});
  protected readonly fields: FormlyFieldConfig[] = buildResetPasswordFormFields();
  protected readonly submitting = signal(false);

  protected readonly email = signal(this.route.snapshot.queryParamMap.get('email') ?? '');
  protected readonly hasEmail = computed(() => !!this.email());

  protected readonly passwordResetCodeExpiresMinutes =
    AUTH_CONSTANTS.PASSWORD_RESET.EXPIRES_MINUTES;

  protected model: Pick<ResetPasswordRequest, 'code' | 'newPassword'> & {
    confirmPassword: string;
  } = {
    code: '',
    newPassword: '',
    confirmPassword: '',
  };

  protected submit(): void {
    if (this.submitting()) {
      return;
    }

    if (!this.hasEmail()) {
      this.handleMissingEmail();
      return;
    }

    if (this.form.invalid) {
      this.handleInvalidForm();
      return;
    }

    const request = this.buildResetPasswordRequest();

    this.submitting.set(true);

    this.authFacade
      .resetPassword(request)
      .pipe(
        finalize(() => {
          this.submitting.set(false);
        }),
      )
      .subscribe({
        next: (response) => {
          this.handleResetPasswordSuccess(
            getApiNotificationMessage(response, AUTH_MESSAGES.RESET_PASSWORD.SUCCESS),
          );
        },
        error: (error: HttpErrorResponse) => {
          this.handleResetPasswordError(
            getApiErrorNotificationMessage(error, AUTH_MESSAGES.RESET_PASSWORD.ERROR),
          );
        },
      });
  }

  private buildResetPasswordRequest(): ResetPasswordRequest {
    return {
      email: this.email(),
      code: this.model.code,
      newPassword: this.model.newPassword,
    };
  }

  private handleInvalidForm(): void {
    this.markFormAsTouched();
    this.notificationService.warn('Formulario', UI_MESSAGES.FORM.INVALID_GENERIC);
  }

  private handleMissingEmail(): void {
    this.notificationService.error('Recuperación', AUTH_MESSAGES.RESET_PASSWORD.EMAIL_NOT_FOUND);

    void this.router.navigate(['/auth/forgot-password']);
  }

  private handleResetPasswordSuccess(message: NotificationMessage): void {
    this.notificationService.success('Recuperación', message);
    void this.router.navigate(['/auth/login']);
  }

  private handleResetPasswordError(message: NotificationMessage): void {
    this.notificationService.error('Recuperación', message);
  }

  private markFormAsTouched(): void {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();
  }
}
