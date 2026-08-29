import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldType, FieldTypeConfig, FormlyModule } from '@ngx-formly/core';
import { DividerModule } from 'primeng/divider';
import { PasswordModule } from 'primeng/password';

import {
  PASSWORD_REQUIREMENTS,
  PASSWORD_STRENGTH_LABELS,
  PASSWORD_STRONG_REGEX,
} from '@shared/constants/password.constants';

@Component({
  selector: 'app-password-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormlyModule, PasswordModule, DividerModule],
  templateUrl: './app-password-field.component.html',
  styleUrl: './app-password-field.component.scss',
})
export class AppPasswordFieldComponent extends FieldType<FieldTypeConfig> {
  protected get inputId(): string {
    return this.field.id || this.id;
  }

  protected get autocomplete(): string {
    return this.props['autocomplete'] ?? 'off';
  }

  protected get toggleMask(): boolean {
    return this.props['toggleMask'] ?? true;
  }

  protected get feedback(): boolean {
    return this.props['feedback'] ?? false;
  }

  protected get strongRegex(): string {
    const regex = this.props['strongRegex'] ?? PASSWORD_STRONG_REGEX;
    return typeof regex === 'string' ? regex : regex.source;
  }

  protected get promptLabel(): string {
    return this.props['promptLabel'] ?? PASSWORD_STRENGTH_LABELS.prompt;
  }

  protected get weakLabel(): string {
    return this.props['weakLabel'] ?? PASSWORD_STRENGTH_LABELS.weak;
  }

  protected get mediumLabel(): string {
    return this.props['mediumLabel'] ?? PASSWORD_STRENGTH_LABELS.medium;
  }

  protected get strongLabel(): string {
    return this.props['strongLabel'] ?? PASSWORD_STRENGTH_LABELS.strong;
  }

  protected get requirements(): string[] {
    return this.props['requirements'] ?? PASSWORD_REQUIREMENTS;
  }
}
