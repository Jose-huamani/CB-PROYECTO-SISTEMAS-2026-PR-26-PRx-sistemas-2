import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldType, FieldTypeConfig, FormlyModule } from '@ngx-formly/core';
import { InputOtpModule } from 'primeng/inputotp';

import { AUTH_CONSTANTS } from '@shared/constants/auth.constants';

@Component({
  selector: 'app-otp-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormlyModule, InputOtpModule],
  templateUrl: './app-otp-field.component.html',
  styleUrl: './app-otp-field.component.scss',
})
export class AppOtpFieldComponent extends FieldType<FieldTypeConfig> {
  protected get inputId(): string {
    return this.field.id || this.id;
  }

  protected get length(): number {
    return this.props['length'] ?? AUTH_CONSTANTS.VERIFICATION.CODE_LENGTH;
  }

  protected get integerOnly(): boolean {
    return this.props['integerOnly'] ?? true;
  }

  protected get mask(): boolean {
    return this.props['mask'] ?? false;
  }

  protected get helperText(): string | undefined {
    return this.props['helperText'] ?? this.props['description'];
  }
}
