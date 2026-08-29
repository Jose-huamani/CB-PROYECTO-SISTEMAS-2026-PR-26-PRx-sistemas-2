import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldType, FieldTypeConfig, FormlyModule } from '@ngx-formly/core';
import { ButtonModule } from 'primeng/button';
import { FileSelectEvent, FileUploadModule } from 'primeng/fileupload';

import { FILE_UPLOAD_LABELS, FILE_UPLOAD_MESSAGES } from '@shared/constants/file-upload.constants';
import { getFileIconByExtension } from '@shared/utils/file-icon.util';
import { formatFileSize } from '@shared/utils/file-size.util';

@Component({
  selector: 'app-file-upload-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormlyModule, FileUploadModule, ButtonModule],
  templateUrl: './app-file-upload-field.component.html',
  styleUrl: './app-file-upload-field.component.scss',
})
export class AppFileUploadFieldComponent extends FieldType<FieldTypeConfig> {
  protected get inputId(): string {
    return this.field.id || this.id;
  }

  protected get chooseLabel(): string {
    return this.props['chooseLabel'] ?? FILE_UPLOAD_LABELS.choose;
  }

  protected get chooseIcon(): string {
    return this.props['chooseIcon'] ?? 'pi pi-upload';
  }

  protected get accept(): string | undefined {
    return this.props['accept'];
  }

  protected get maxFileSize(): number | undefined {
    return this.props['maxFileSize'];
  }

  protected get multiple(): boolean {
    return this.props['multiple'] ?? false;
  }

  protected get maxFiles(): number {
    return this.props['maxFiles'] ?? (this.multiple ? 5 : 1);
  }

  protected get clearLabel(): string {
    if (this.props['clearLabel']) {
      return this.props['clearLabel'];
    }

    return this.multiple ? FILE_UPLOAD_LABELS.clearMultiple : FILE_UPLOAD_LABELS.clearSingle;
  }

  protected get invalidFileSizeMessageSummary(): string {
    return this.props['invalidFileSizeMessageSummary'] ?? FILE_UPLOAD_MESSAGES.invalidSizeSummary;
  }

  protected get invalidFileSizeMessageDetail(): string {
    return this.props['invalidFileSizeMessageDetail'] ?? FILE_UPLOAD_MESSAGES.invalidSizeDetail;
  }

  protected get invalidFileTypeMessageSummary(): string {
    return this.props['invalidFileTypeMessageSummary'] ?? FILE_UPLOAD_MESSAGES.invalidTypeSummary;
  }

  protected get invalidFileTypeMessageDetail(): string {
    return this.props['invalidFileTypeMessageDetail'] ?? FILE_UPLOAD_MESSAGES.invalidTypeDetail;
  }

  protected get selectedFiles(): File[] {
    const value = this.formControl.value;

    if (!value) {
      return [];
    }

    return Array.isArray(value) ? value : [value];
  }

  protected get canChooseFile(): boolean {
    if (this.props.disabled) {
      return false;
    }

    if (!this.multiple && this.selectedFiles.length >= 1) {
      return false;
    }

    if (this.multiple && this.selectedFiles.length >= this.maxFiles) {
      return false;
    }

    return true;
  }

  protected handleSelect(event: FileSelectEvent): void {
    const files = event.currentFiles ?? [];

    if (!files.length) {
      return;
    }

    const limitedFiles = files.slice(0, this.maxFiles);

    if (this.multiple) {
      this.formControl.setValue(limitedFiles);
    } else {
      this.formControl.setValue(limitedFiles[limitedFiles.length - 1] ?? null);
    }

    this.markControlAsChanged();
  }

  protected removeFile(
    event: Event,
    index: number,
    removeFileCallback: (event: Event, index: number) => void,
  ): void {
    removeFileCallback(event, index);

    if (!this.multiple) {
      this.formControl.setValue(null);
      this.markControlAsChanged();
      return;
    }

    const files = this.selectedFiles.filter((_, fileIndex) => fileIndex !== index);

    this.formControl.setValue(files);
    this.markControlAsChanged();
  }

  protected clearFiles(clearCallback: () => void): void {
    clearCallback();
    this.formControl.setValue(this.multiple ? [] : null);
    this.markControlAsChanged();
  }

  protected getFileSize(file: File): string {
    return formatFileSize(file.size);
  }

  protected getFileIcon(file: File): string {
    return getFileIconByExtension(this.getFileExtension(file.name));
  }

  private getFileExtension(fileName: string): string {
    const extensionStartIndex = fileName.lastIndexOf('.');

    if (extensionStartIndex === -1) {
      return '';
    }

    return fileName.slice(extensionStartIndex + 1);
  }

  private markControlAsChanged(): void {
    this.formControl.markAsDirty();
    this.formControl.markAsTouched();
    this.formControl.updateValueAndValidity();
  }
}
