import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldType, FieldTypeConfig, FormlyModule } from '@ngx-formly/core';

type ColorOptionValue = string;

interface ColorOptionItem {
  label: string;
  value: ColorOptionValue;
  disabled?: boolean;
}

@Component({
  selector: 'app-color-options-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormlyModule],
  templateUrl: './app-color-options-field.component.html',
  styleUrl: './app-color-options-field.component.scss',
})
export class AppColorOptionsFieldComponent extends FieldType<FieldTypeConfig> {
  protected get colorOptions(): ColorOptionItem[] {
    return (this.props['options'] as ColorOptionItem[]) ?? [];
  }

  protected get isFieldDisabled(): boolean {
    return !!this.props.disabled || !!this.props.readonly;
  }

  protected isSelected(value: ColorOptionValue): boolean {
    return this.normalizeColor(this.formControl.value) === this.normalizeColor(value);
  }

  protected selectOption(option: ColorOptionItem): void {
    if (this.isFieldDisabled || option.disabled) {
      return;
    }

    this.formControl.setValue(this.normalizeColor(option.value));
    this.formControl.markAsDirty();
    this.formControl.markAsTouched();
  }

  protected getColorValue(value: ColorOptionValue): string {
    const normalizedColor = this.normalizeColor(value);

    if (!normalizedColor) {
      return 'transparent';
    }

    return `#${normalizedColor}`;
  }

  private normalizeColor(value: unknown): string {
    if (typeof value !== 'string') {
      return '';
    }

    return value.replace('#', '').trim().toUpperCase();
  }
}
