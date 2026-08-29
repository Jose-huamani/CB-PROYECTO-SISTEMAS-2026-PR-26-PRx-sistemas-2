import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

import { buildCreateFileFormFields } from '@features/files/application/forms/create-file.form';
import { CreateFileRequest } from '@features/files/domain/requests/create-file.request';

interface CreateFileDialogFormModel {
  name: string;
  tags: string[];
  file: File | null;
}

export type CreateFileDialogSubmit = Pick<CreateFileRequest, 'name' | 'tags' | 'file'>;

@Component({
  selector: 'app-create-file-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormlyModule, DialogModule, ButtonModule],
  templateUrl: './create-file-dialog.component.html',
  styleUrl: './create-file-dialog.component.scss',
})
export class CreateFileDialogComponent {
  readonly visible = input(false);
  readonly loading = input(false);

  readonly visibleChange = output<boolean>();
  readonly create = output<CreateFileDialogSubmit>();

  protected readonly form = new FormGroup({});
  protected readonly fields: FormlyFieldConfig[] = buildCreateFileFormFields();

  protected model: CreateFileDialogFormModel = {
    name: '',
    tags: [],
    file: null,
  };

  protected submit(): void {
    if (this.loading()) {
      return;
    }

    if (this.form.invalid) {
      this.markFormAsTouched();
      return;
    }

    const value = this.form.getRawValue() as CreateFileDialogFormModel;

    if (!value.file) {
      this.markFormAsTouched();
      return;
    }

    this.create.emit({
      name: value.name,
      tags: value.tags,
      file: value.file,
    });
  }

  protected close(): void {
    this.reset();
    this.visibleChange.emit(false);
  }

  protected handleVisibleChange(value: boolean): void {
    if (!value) {
      this.reset();
    }

    this.visibleChange.emit(value);
  }

  protected reset(): void {
    this.model = {
      name: '',
      tags: [],
      file: null,
    };

    this.form.reset(this.model);
  }

  private markFormAsTouched(): void {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();
  }
}
