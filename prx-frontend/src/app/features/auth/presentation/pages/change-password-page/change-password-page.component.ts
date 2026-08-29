import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { ButtonModule } from 'primeng/button';
import { finalize } from 'rxjs';

import { NotificationService } from '@core/services/notification.service';
import { AuthFacade } from '@features/auth/application/facades/auth.facade';
import { buildChangePasswordFormFields } from '@features/auth/application/forms/change-password.form';
import { AUTH_MESSAGES } from '@features/auth/constants/auth-messages.constants';
import { ChangePasswordRequest } from '@features/auth/domain/requests/change-password.request';
import { UI_MESSAGES } from '@shared/constants/ui-messages.constants';
import { NotificationMessage } from '@shared/types/notification-message.type';
import {
  getApiErrorNotificationMessage,
  getApiNotificationMessage,
} from '@shared/utils/api-notification.util';

interface ChangePasswordFormValue extends ChangePasswordRequest {
  confirmPassword: string;
}

@Component({
  selector: 'app-change-password-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormlyModule, ButtonModule],
  templateUrl: './change-password-page.component.html',
  styleUrl: './change-password-page.component.scss',
})
export class ChangePasswordPageComponent {
  private readonly authFacade = inject(AuthFacade);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  protected readonly form = new FormGroup({});
  protected readonly fields: FormlyFieldConfig[] = buildChangePasswordFormFields();
  protected readonly submitting = signal(false);

  protected model: ChangePasswordFormValue = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  protected submit(): void {
    if (this.submitting()) {
      return;
    }

    if (this.form.invalid) {
      this.handleInvalidForm();
      return;
    }

    const request = this.buildChangePasswordRequest();

    this.submitting.set(true);

    this.authFacade
      .changePassword({
        currentPassword: request.currentPassword,
        newPassword: request.newPassword,
      })
      .pipe(
        finalize(() => {
          this.submitting.set(false);
        }),
      )
      .subscribe({
        next: (response) => {
          this.handleChangePasswordSuccess(
            getApiNotificationMessage(response, AUTH_MESSAGES.CHANGE_PASSWORD.SUCCESS),
          );
        },
        error: (error: HttpErrorResponse) => {
          this.handleChangePasswordError(
            getApiErrorNotificationMessage(error, AUTH_MESSAGES.CHANGE_PASSWORD.ERROR),
          );
        },
      });
  }

  protected cancel(): void {
    void this.router.navigate(['/']);
  }

  private buildChangePasswordRequest(): ChangePasswordFormValue {
    return this.form.getRawValue() as ChangePasswordFormValue;
  }

  private handleInvalidForm(): void {
    this.markFormAsTouched();
    this.notificationService.warn('Formulario', UI_MESSAGES.FORM.INVALID_GENERIC);
  }

  private handleChangePasswordSuccess(message: NotificationMessage): void {
    this.notificationService.success('Contraseña', message);
    this.form.reset();
    void this.router.navigate(['/']);
  }

  private handleChangePasswordError(message: NotificationMessage): void {
    this.notificationService.error('Contraseña', message);
  }

  private markFormAsTouched(): void {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();
  }
}
