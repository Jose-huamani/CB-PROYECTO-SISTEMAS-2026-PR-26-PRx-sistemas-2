import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldType, FieldTypeConfig, FormlyModule } from '@ngx-formly/core';

type OptionCardValue = string | number | boolean;

interface OptionCardItem {
  label: string;
  value: OptionCardValue;
  description?: string;
  icon?: string;
  iconClass?: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-option-cards-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormlyModule],
  templateUrl: './app-option-cards-field.component.html',
  styleUrl: './app-option-cards-field.component.scss',
})
export class AppOptionCardsFieldComponent extends FieldType<FieldTypeConfig> {
  protected get cardOptions(): OptionCardItem[] {
    return (this.props['options'] as OptionCardItem[]) ?? [];
  }

  protected get isFieldDisabled(): boolean {
    return !!this.props.disabled || !!this.props.readonly;
  }

  protected get columns(): number {
    const columns = this.props['columns'];

    if (typeof columns !== 'number' || columns < 1) {
      return 1;
    }

    return columns;
  }

  protected isSelected(value: OptionCardValue): boolean {
    return this.formControl.value === value;
  }

  protected selectOption(option: OptionCardItem): void {
    if (this.isFieldDisabled || option.disabled) {
      return;
    }

    this.formControl.setValue(option.value);
    this.formControl.markAsDirty();
    this.formControl.markAsTouched();
  }

  protected getIconClass(option: OptionCardItem): string {
    const defaultIconClass = this.props['iconClass'] ?? 'text-lg';

    return `${option.icon} ${option.iconClass ?? defaultIconClass}`;
  }
}
