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
import { buildRegisterRequestFormFields } from '@features/auth/application/forms/register-request.form';
import { AUTH_MESSAGES } from '@features/auth/constants/auth-messages.constants';
import { RegisterRequestData } from '@features/auth/domain/requests/register-request.request';
import { UI_MESSAGES } from '@shared/constants/ui-messages.constants';
import { NotificationMessage } from '@shared/types/notification-message.type';
import {
  getApiErrorNotificationMessage,
  getApiNotificationMessage,
} from '@shared/utils/api-notification.util';

interface RegisterRequestFormValue extends RegisterRequestData {
  confirmPassword: string;
}

@Component({
  selector: 'app-register-request-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormlyModule, ButtonModule, RouterLink],
  templateUrl: './register-request-page.component.html',
  styleUrl: './register-request-page.component.scss',
})
export class RegisterRequestPageComponent {
  private readonly authFacade = inject(AuthFacade);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  protected readonly form = new FormGroup({});
  protected readonly fields: FormlyFieldConfig[] = buildRegisterRequestFormFields();
  protected readonly submitting = signal(false);

  protected model: RegisterRequestFormValue = {
    email: '',
    username: '',
    password: '',
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

    const request = this.buildRegisterRequest();

    this.submitting.set(true);

    this.authFacade
      .registerRequest({
        email: request.email,
        username: request.username,
        password: request.password,
      })
      .pipe(
        finalize(() => {
          this.submitting.set(false);
        }),
      )
      .subscribe({
        next: (response) => {
          this.handleRegisterRequestSuccess(
            request.email,
            getApiNotificationMessage(response, AUTH_MESSAGES.REGISTER_REQUEST.SUCCESS),
          );
        },
        error: (error: HttpErrorResponse) => {
          this.handleRegisterRequestError(
            getApiErrorNotificationMessage(error, AUTH_MESSAGES.REGISTER_REQUEST.ERROR),
          );
        },
      });
  }

  private buildRegisterRequest(): RegisterRequestFormValue {
    return this.form.getRawValue() as RegisterRequestFormValue;
  }

  private handleInvalidForm(): void {
    this.markFormAsTouched();
    this.notificationService.warn('Formulario', UI_MESSAGES.FORM.INVALID_GENERIC);
  }

  private handleRegisterRequestSuccess(email: string, message: NotificationMessage): void {
    this.notificationService.success('Registro', message);

    void this.router.navigate(['/auth/confirm-register'], {
      queryParams: {
        email,
      },
    });
  }

  private handleRegisterRequestError(message: NotificationMessage): void {
    this.notificationService.error('Registro', message);
  }

  private markFormAsTouched(): void {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();
  }
}
