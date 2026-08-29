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
import { buildLoginFormFields } from '@features/auth/application/forms/login.form';
import { AUTH_MESSAGES } from '@features/auth/constants/auth-messages.constants';
import { LoginRequest } from '@features/auth/domain/requests/login.request';
import { UI_MESSAGES } from '@shared/constants/ui-messages.constants';
import { NotificationMessage } from '@shared/types/notification-message.type';
import {
  getApiErrorNotificationMessage,
  getApiNotificationMessage,
} from '@shared/utils/api-notification.util';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormlyModule, ButtonModule, RouterLink],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent {
  private readonly authFacade = inject(AuthFacade);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  protected readonly form = new FormGroup({});
  protected readonly fields: FormlyFieldConfig[] = buildLoginFormFields();
  protected readonly submitting = signal(false);

  protected model: LoginRequest = {
    identifier: '',
    password: '',
  };

  protected submit(): void {
    if (this.submitting()) {
      return;
    }

    if (this.form.invalid) {
      this.handleInvalidForm();
      return;
    }

    const request = this.buildLoginRequest();

    this.submitting.set(true);

    this.authFacade
      .login(request)
      .pipe(
        finalize(() => {
          this.submitting.set(false);
        }),
      )
      .subscribe({
        next: (response) => {
          this.handleLoginSuccess(getApiNotificationMessage(response, AUTH_MESSAGES.LOGIN.SUCCESS));
        },
        error: (error: HttpErrorResponse) => {
          this.handleLoginError(getApiErrorNotificationMessage(error, AUTH_MESSAGES.LOGIN.ERROR));
        },
      });
  }

  private buildLoginRequest(): LoginRequest {
    return this.form.getRawValue() as LoginRequest;
  }

  private handleInvalidForm(): void {
    this.markFormAsTouched();
    this.notificationService.warn('Formulario', UI_MESSAGES.FORM.INVALID_REQUIRED);
  }

  private handleLoginSuccess(message: NotificationMessage): void {
    this.notificationService.success('Autenticación', message);
    void this.router.navigateByUrl('/');
  }

  private handleLoginError(message: NotificationMessage): void {
    this.notificationService.error('Autenticación', message);
  }

  private markFormAsTouched(): void {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();
  }
}
