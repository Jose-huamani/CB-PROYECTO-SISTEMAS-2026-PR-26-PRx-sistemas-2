import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldType, FieldTypeConfig, FormlyModule } from '@ngx-formly/core';
import { InputTextModule } from 'primeng/inputtext';
import { KeyFilterModule } from 'primeng/keyfilter';

@Component({
  selector: 'app-input-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormlyModule, InputTextModule, KeyFilterModule],
  templateUrl: './app-input-field.component.html',
  styleUrl: './app-input-field.component.scss',
})
export class AppInputFieldComponent extends FieldType<FieldTypeConfig> {
  protected get inputType(): string {
    return this.props['type'] ?? 'text';
  }

  protected get inputId(): string {
    return this.id;
  }

  protected handleInputTransform(event: Event): void {
    const input = event.target as HTMLInputElement;
    const transformedValue = this.transformValue(input.value);

    if (transformedValue === input.value) {
      return;
    }

    input.value = transformedValue;
    this.formControl.setValue(transformedValue, {
      emitEvent: false,
    });
  }

  protected handleBlurTransform(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    if (this.props['trim']) {
      value = value.trim();
    }

    if (value === input.value) {
      return;
    }

    input.value = value;
    this.formControl.setValue(value, {
      emitEvent: false,
    });
    this.formControl.markAsTouched();
  }

  private transformValue(value: string): string {
    let transformedValue = value;

    if (this.props['normalizeSpaces']) {
      transformedValue = transformedValue.replace(/\s+/g, ' ');
    }

    if (this.props['forceLowercase']) {
      transformedValue = transformedValue.toLowerCase();
    }

    if (this.props['forceUppercase']) {
      transformedValue = transformedValue.toUpperCase();
    }

    return transformedValue;
  }
}
