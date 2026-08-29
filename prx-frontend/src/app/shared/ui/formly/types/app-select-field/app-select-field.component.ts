import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldType, FieldTypeConfig, FormlyModule } from '@ngx-formly/core';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-select-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormlyModule, SelectModule],
  templateUrl: './app-select-field.component.html',
  styleUrl: './app-select-field.component.scss',
})
export class AppSelectFieldComponent extends FieldType<FieldTypeConfig> {
  protected get inputId(): string {
    return this.id;
  }

  protected get selectOptions(): unknown[] {
    const options = this.props['options'];

    return Array.isArray(options) ? options : [];
  }
}
