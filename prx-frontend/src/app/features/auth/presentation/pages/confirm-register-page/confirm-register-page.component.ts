import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { ButtonModule } from 'primeng/button';
import { finalize } from 'rxjs';

import { NotificationService } from '@core/services/notification.service';
import { AuthFacade } from '@features/auth/application/facades/auth.facade';
import { buildConfirmRegisterFormFields } from '@features/auth/application/forms/confirm-register.form';
import { AUTH_MESSAGES } from '@features/auth/constants/auth-messages.constants';
import { ConfirmRegisterRequest } from '@features/auth/domain/requests/confirm-register.request';
import { ResendCodeRequest } from '@features/auth/domain/requests/resend-code.request';
import { AUTH_CONSTANTS } from '@shared/constants/auth.constants';
import { UI_MESSAGES } from '@shared/constants/ui-messages.constants';
import { NotificationMessage } from '@shared/types/notification-message.type';
import {
  getApiErrorNotificationMessage,
  getApiNotificationMessage,
} from '@shared/utils/api-notification.util';
import { createCooldown } from '@shared/utils/cooldown.util';

@Component({
  selector: 'app-confirm-register-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormlyModule, ButtonModule],
  templateUrl: './confirm-register-page.component.html',
  styleUrl: './confirm-register-page.component.scss',
})
export class ConfirmRegisterPageComponent {
  private readonly authFacade = inject(AuthFacade);
  private readonly notificationService = inject(NotificationService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  private readonly resendCooldownCtrl = createCooldown(
    this.destroyRef,
    'confirm-register-resend-cooldown',
  );

  protected readonly form = new FormGroup({});
  protected readonly fields: FormlyFieldConfig[] = buildConfirmRegisterFormFields();
  protected readonly submitting = signal(false);
  protected readonly resending = signal(false);

  protected readonly email = signal(this.route.snapshot.queryParamMap.get('email') ?? '');
  protected readonly hasEmail = computed(() => !!this.email());

  protected readonly verificationCodeExpiresMinutes = AUTH_CONSTANTS.VERIFICATION.EXPIRES_MINUTES;

  protected readonly isResendBlocked = computed(
    () => this.resending() || this.resendCooldownCtrl.isActive(),
  );

  protected readonly resendCooldown = computed(() => this.resendCooldownCtrl.value());

  protected model: Pick<ConfirmRegisterRequest, 'code'> = {
    code: '',
  };

  protected submit(): void {
    if (this.submitting()) {
      return;
    }

    if (!this.hasEmail()) {
      this.handleMissingEmailForConfirmation();
      return;
    }

    if (this.form.invalid) {
      this.handleInvalidForm();
      return;
    }

    const request = this.buildConfirmRegisterRequest();

    this.submitting.set(true);

    this.authFacade
      .confirmRegister(request)
      .pipe(
        finalize(() => {
          this.submitting.set(false);
        }),
      )
      .subscribe({
        next: (response) => {
          this.handleConfirmRegisterSuccess(
            getApiNotificationMessage(response, AUTH_MESSAGES.CONFIRM_REGISTER.SUCCESS),
          );
        },
        error: (error: HttpErrorResponse) => {
          this.handleConfirmRegisterError(
            getApiErrorNotificationMessage(error, AUTH_MESSAGES.CONFIRM_REGISTER.ERROR),
          );
        },
      });
  }

  protected resendCode(): void {
    if (this.resending()) {
      return;
    }

    if (!this.hasEmail()) {
      this.handleMissingEmailForResend();
      return;
    }

    if (this.isResendBlocked()) {
      return;
    }

    const request = this.buildResendCodeRequest();

    this.resending.set(true);

    this.authFacade
      .resendVerificationCode(request)
      .pipe(
        finalize(() => {
          this.resending.set(false);
        }),
      )
      .subscribe({
        next: (response) => {
          this.handleResendCodeSuccess(
            getApiNotificationMessage(response, AUTH_MESSAGES.RESEND_VERIFICATION_CODE.SUCCESS),
          );
        },
        error: (error: HttpErrorResponse) => {
          this.handleResendCodeError(
            getApiErrorNotificationMessage(error, AUTH_MESSAGES.RESEND_VERIFICATION_CODE.ERROR),
          );
        },
      });
  }

  protected goBack(): void {
    void this.router.navigate(['/auth/register-request']);
  }

  private buildConfirmRegisterRequest(): ConfirmRegisterRequest {
    return {
      email: this.email(),
      code: this.model.code,
    };
  }

  private buildResendCodeRequest(): ResendCodeRequest {
    return {
      email: this.email(),
    };
  }

  private handleInvalidForm(): void {
    this.markFormAsTouched();
    this.notificationService.warn('Formulario', UI_MESSAGES.FORM.INVALID_GENERIC);
  }

  private handleMissingEmailForConfirmation(): void {
    this.notificationService.error('Confirmación', AUTH_MESSAGES.CONFIRM_REGISTER.EMAIL_NOT_FOUND);

    void this.router.navigate(['/auth/register-request']);
  }

  private handleMissingEmailForResend(): void {
    this.notificationService.error(
      'Reenvío',
      AUTH_MESSAGES.RESEND_VERIFICATION_CODE.EMAIL_NOT_FOUND,
    );
  }

  private handleConfirmRegisterSuccess(message: NotificationMessage): void {
    this.notificationService.success('Confirmación', message);
    void this.router.navigate(['/auth/login']);
  }

  private handleConfirmRegisterError(message: NotificationMessage): void {
    this.notificationService.error('Confirmación', message);
  }

  private handleResendCodeSuccess(message: NotificationMessage): void {
    this.notificationService.success('Reenvío', message);
    this.clearVerificationCode();
    this.resendCooldownCtrl.start(AUTH_CONSTANTS.VERIFICATION.RESEND_COOLDOWN_SECONDS);
  }

  private handleResendCodeError(message: NotificationMessage): void {
    this.notificationService.error('Reenvío', message);
  }

  private clearVerificationCode(): void {
    this.model.code = '';

    const control = this.form.get('code');

    if (control) {
      control.reset('');
    }
  }

  private markFormAsTouched(): void {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();
  }
}
