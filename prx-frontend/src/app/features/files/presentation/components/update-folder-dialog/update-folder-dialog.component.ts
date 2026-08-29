import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

import { buildUpdateFolderFormFields } from '@features/files/application/forms/update-folder.form';
import { FolderModel } from '@features/files/domain/models/folder.model';
import { UpdateFolderRequest } from '@features/files/domain/requests/update-folder.request';

export type UpdateFolderDialogSubmit = Required<Pick<UpdateFolderRequest, 'name' | 'color'>>;

@Component({
  selector: 'app-update-folder-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormlyModule, DialogModule, ButtonModule],
  templateUrl: './update-folder-dialog.component.html',
  styleUrl: './update-folder-dialog.component.scss',
})
export class UpdateFolderDialogComponent {
  readonly visible = input(false);
  readonly loading = input(false);
  readonly folder = input<FolderModel | null>(null);

  readonly visibleChange = output<boolean>();
  readonly update = output<UpdateFolderDialogSubmit>();

  protected readonly form = new FormGroup({});
  protected readonly fields: FormlyFieldConfig[] = buildUpdateFolderFormFields();

  protected model: UpdateFolderDialogSubmit = {
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

    this.update.emit(this.form.getRawValue() as UpdateFolderDialogSubmit);
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
    const folder = this.folder();

    this.model = {
      name: folder?.name ?? '',
      color: folder?.color ?? 'C9E4DE',
    };

    this.form.reset(this.model);
  }

  private markFormAsTouched(): void {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();
  }
}
