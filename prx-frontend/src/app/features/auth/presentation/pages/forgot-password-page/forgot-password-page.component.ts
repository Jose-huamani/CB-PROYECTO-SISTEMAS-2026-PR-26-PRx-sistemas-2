import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { ButtonModule } from 'primeng/button';
import { finalize } from 'rxjs';

import { NotificationService } from '@core/services/notification.service';
import { AuthFacade } from '@features/auth/application/facades/auth.facade';
import { buildForgotPasswordFormFields } from '@features/auth/application/forms/forgot-password.form';
import { AUTH_MESSAGES } from '@features/auth/constants/auth-messages.constants';
import { ForgotPasswordRequest } from '@features/auth/domain/requests/forgot-password.request';
import { UI_MESSAGES } from '@shared/constants/ui-messages.constants';
import { NotificationMessage } from '@shared/types/notification-message.type';
import {
  getApiErrorNotificationMessage,
  getApiNotificationMessage,
} from '@shared/utils/api-notification.util';

@Component({
  selector: 'app-forgot-password-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormlyModule, ButtonModule, RouterLink],
  templateUrl: './forgot-password-page.component.html',
  styleUrl: './forgot-password-page.component.scss',
})
export class ForgotPasswordPageComponent {
  private readonly authFacade = inject(AuthFacade);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  protected readonly form = new FormGroup({});
  protected readonly fields: FormlyFieldConfig[] = buildForgotPasswordFormFields();
  protected readonly submitting = signal(false);

  protected model: ForgotPasswordRequest = {
    email: '',
  };

  protected submit(): void {
    if (this.submitting()) {
      return;
    }

    if (this.form.invalid) {
      this.handleInvalidForm();
      return;
    }

    const request = this.buildForgotPasswordRequest();

    this.submitting.set(true);

    this.authFacade
      .forgotPassword(request)
      .pipe(
        finalize(() => {
          this.submitting.set(false);
        }),
      )
      .subscribe({
        next: (response) => {
          this.handleForgotPasswordSuccess(
            request.email,
            getApiNotificationMessage(response, AUTH_MESSAGES.FORGOT_PASSWORD.SUCCESS),
          );
        },
        error: (error: HttpErrorResponse) => {
          this.handleForgotPasswordError(
            getApiErrorNotificationMessage(error, AUTH_MESSAGES.FORGOT_PASSWORD.ERROR),
          );
        },
      });
  }

  private buildForgotPasswordRequest(): ForgotPasswordRequest {
    return this.form.getRawValue() as ForgotPasswordRequest;
  }

  private handleInvalidForm(): void {
    this.markFormAsTouched();
    this.notificationService.warn('Formulario', UI_MESSAGES.FORM.INVALID_GENERIC);
  }

  private handleForgotPasswordSuccess(email: string, message: NotificationMessage): void {
    this.notificationService.success('Recuperación', message);

    void this.router.navigate(['/auth/reset-password'], {
      queryParams: {
        email,
      },
    });
  }

  private handleForgotPasswordError(message: NotificationMessage): void {
    this.notificationService.error('Recuperación', message);
  }

  private markFormAsTouched(): void {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();
  }
}
