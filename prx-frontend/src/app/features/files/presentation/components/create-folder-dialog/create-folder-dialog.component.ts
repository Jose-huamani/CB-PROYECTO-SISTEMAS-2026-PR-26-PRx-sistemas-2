import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

import { buildCreateFolderFormFields } from '@features/files/application/forms/create-folder.form';
import { CreateFolderRequest } from '@features/files/domain/requests/create-folder.request';

export type CreateFolderDialogSubmit = Pick<CreateFolderRequest, 'name' | 'color'>;

@Component({
  selector: 'app-create-folder-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormlyModule, DialogModule, ButtonModule],
  templateUrl: './create-folder-dialog.component.html',
  styleUrl: './create-folder-dialog.component.scss',
})
export class CreateFolderDialogComponent {
  readonly visible = input(false);
  readonly loading = input(false);

  readonly visibleChange = output<boolean>();
  readonly create = output<CreateFolderDialogSubmit>();

  protected readonly form = new FormGroup({});
  protected readonly fields: FormlyFieldConfig[] = buildCreateFolderFormFields();

  protected model: CreateFolderDialogSubmit = {
    name: '',
    color: 'C9E4DE',
  };

  protected submit(): void {
    if (this.loading()) {
      return;
    }

    if (this.form.invalid) {
      this.markFormAsTouched();
      return;
    }

    this.create.emit(this.form.getRawValue() as CreateFolderDialogSubmit);
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
      color: 'C9E4DE',
    };
    this.form.reset(this.model);
  }

  private markFormAsTouched(): void {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();
  }
}
