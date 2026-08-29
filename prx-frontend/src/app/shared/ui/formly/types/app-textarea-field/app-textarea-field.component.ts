import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldType, FieldTypeConfig, FormlyModule } from '@ngx-formly/core';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-textarea-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormlyModule, TextareaModule],
  templateUrl: './app-textarea-field.component.html',
  styleUrl: './app-textarea-field.component.scss',
})
export class AppTextareaFieldComponent extends FieldType<FieldTypeConfig> {
  protected get inputId(): string {
    return this.id;
  }

  protected handleInputTransform(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    const transformedValue = this.transformValue(textarea.value);

    if (transformedValue === textarea.value) {
      return;
    }

    textarea.value = transformedValue;
    this.formControl.setValue(transformedValue, {
      emitEvent: false,
    });
  }

  protected handleBlurTransform(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    let value = textarea.value;

    if (this.props['trim']) {
      value = value.trim();
    }

    if (value === textarea.value) {
      return;
    }

    textarea.value = value;
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
