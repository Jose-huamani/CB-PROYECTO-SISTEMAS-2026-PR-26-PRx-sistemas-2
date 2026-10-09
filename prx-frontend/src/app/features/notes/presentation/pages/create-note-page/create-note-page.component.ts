import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnDestroy, signal } from '@angular/core';
import { FormsModule, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { finalize, mergeMap, take, throwError } from 'rxjs';

import { NoteFacade } from '@features/notes/application/facades/note.facade';
import { RepositoryFacade } from '@features/repositories/application/facades/repository.facade';
import { buildCreateNoteFormFields } from '@features/notes/application/forms/create-note.form';
import { NotificationService } from '@core/services/notification.service';
import { CreateNoteRequest } from '@features/notes/domain/requests/create-note.request';
import { getApiErrorNotificationMessage } from '@shared/utils/api-notification.util';
import { UI_MESSAGES } from '@shared/constants/ui-messages.constants';
import { NOTES_MESSAGES } from '@features/notes/constants/notes-messages.constants';
import { NoteImageEditorComponent } from '@features/notes/presentation/components/note-image-editor/note-image-editor.component';
import { AppConfirmService } from '@core/services/confirm-dialog.service';

interface CreateNoteFormModel {
  title: string;
  content: string;
}

interface NoteLinkDraft {
  id: string;
  url: string;
}

interface NoteImageDraft {
  id: string;
  file: File;
  previewUrl: string;
  edited: boolean;
}

const MAX_NOTE_FILES = 5;
const MAX_FILE_SIZE = 50 * 1024 * 1024;
const EDITABLE_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

@Component({
  selector: 'app-create-note-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormlyModule,
    ButtonModule,
    CardModule,
    NoteImageEditorComponent,
  ],
  templateUrl: './create-note-page.component.html',
  styleUrl: './create-note-page.component.scss',
})
export class CreateNotePageComponent implements OnDestroy {
  private readonly noteFacade = inject(NoteFacade);
  private readonly repositoryFacade = inject(RepositoryFacade);
  private readonly notificationService = inject(NotificationService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly confirmService = inject(AppConfirmService);

  protected readonly form = new FormGroup({});
  protected readonly fields: FormlyFieldConfig[] = buildCreateNoteFormFields();
  protected readonly submitting = signal(false);
  protected readonly attachmentFiles = signal<File[]>([]);
  protected readonly images = signal<NoteImageDraft[]>([]);
  protected readonly links = signal<NoteLinkDraft[]>([]);
  protected readonly imageBeingEdited = signal<NoteImageDraft | null>(null);
  protected newLinkUrl = '';

  protected model: CreateNoteFormModel = {
    title: '',
    content: '',
  };

  protected readonly isIntimateRepository = computed(
    () => !this.route.snapshot.paramMap.has('repositoryId'),
  );

  protected submit(): void {
    if (this.submitting()) {
      return;
    }

    if (this.form.invalid) {
      this.handleInvalidForm();
      return;
    }

    this.submitting.set(true);

    const value = this.form.getRawValue() as CreateNoteFormModel;

    const title = value.title?.trim();
    const content = value.content?.trim();

    if (!title || !content) {
      this.submitting.set(false);
      this.form.markAllAsTouched();
      this.notificationService.warn('Notas', NOTES_MESSAGES.REQUIRED_FIELDS);
      return;
    }

    const request: CreateNoteRequest = {
      title,
      content,
      links: this.links(),
    };

    const files = [...this.attachmentFiles(), ...this.images().map((image) => image.file)];
    const repositoryId = this.getRepositoryId();

    if (repositoryId) {
      this.createNote(repositoryId, request, files);
      return;
    }

    this.repositoryFacade
      .findMeIntimate()
      .pipe(
        take(1),
        mergeMap((response) => {
          const repository = response.data;

          if (!repository) {
            return throwError(() => new Error('REPOSITORY_NOT_FOUND'));
          }

          return this.noteFacade.create(repository.id, request, files);
        }),
        finalize(() => {
          this.submitting.set(false);
        }),
      )
      .subscribe({
        next: () => {
          this.notificationService.success('Notas', NOTES_MESSAGES.CREATE_SUCCESS);
          void this.router.navigateByUrl('/notes/repositories/me/intimate');
        },
        error: (error: HttpErrorResponse | Error) => {
          if (error instanceof Error && error.message === 'REPOSITORY_NOT_FOUND') {
            this.handleNoRepository();
            return;
          }

          this.handleLoadError(error as HttpErrorResponse);
        },
      });
  }

  protected cancel(): void {
    const repositoryId = this.getRepositoryId();

    if (!repositoryId) {
      void this.router.navigateByUrl('/notes/repositories/me/intimate');
      return;
    }

    void this.router.navigate(['/notes/repositories', repositoryId]);
  }

  ngOnDestroy(): void {
    this.images().forEach((image) => URL.revokeObjectURL(image.previewUrl));
  }

  protected selectAttachments(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.addAttachments(Array.from(input.files ?? []));
    input.value = '';
  }

  protected selectImages(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.addImages(Array.from(input.files ?? []));
    input.value = '';
  }

  protected dropAttachments(event: DragEvent): void {
    event.preventDefault();
    this.addAttachments(Array.from(event.dataTransfer?.files ?? []));
  }

  protected dropImages(event: DragEvent): void {
    event.preventDefault();
    this.addImages(Array.from(event.dataTransfer?.files ?? []));
  }

  protected allowDrop(event: DragEvent): void {
    event.preventDefault();
  }

  protected removeAttachment(index: number): void {
    const file = this.attachmentFiles()[index];
    if (!file) return;
    this.confirmService.confirmDelete(
      NOTES_MESSAGES.CONFIRM_REMOVE_FILE.replace('{name}', file.name),
      () => this.attachmentFiles.update((files) => files.filter((_, fileIndex) => fileIndex !== index)),
    );
  }

  protected removeImage(id: string): void {
    const image = this.images().find((item) => item.id === id);
    if (!image) return;
    this.confirmService.confirmDelete(
      NOTES_MESSAGES.CONFIRM_REMOVE_IMAGE.replace('{name}', image.file.name),
      () => {
        URL.revokeObjectURL(image.previewUrl);
        this.images.update((images) => images.filter((item) => item.id !== id));
      },
    );
  }

  protected editImage(image: NoteImageDraft): void {
    this.imageBeingEdited.set(image);
  }

  protected saveEditedImage(file: File): void {
    const current = this.imageBeingEdited();
    if (!current) {
      return;
    }

    if (!this.validateFileSize(file)) return;

    URL.revokeObjectURL(current.previewUrl);
    const updated: NoteImageDraft = {
      ...current,
      file,
      previewUrl: URL.createObjectURL(file),
      edited: true,
    };

    this.images.update((images) =>
      images.map((image) => (image.id === current.id ? updated : image)),
    );
    this.imageBeingEdited.set(null);
  }

  protected closeImageEditor(): void {
    this.imageBeingEdited.set(null);
  }

  protected formatFileSize(size: number): string {
    if (size < 1024 * 1024) {
      return `${Math.max(1, Math.round(size / 1024))} KB`;
    }

    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }

  protected addLink(): void {
    const url = this.normalizeUrl(this.newLinkUrl);
    if (!url) {
      return;
    }

    if (!this.isValidUrl(url)) {
      this.notificationService.warn('Notas', 'Ingresa una URL válida.');
      return;
    }

    if (url.length > 2048) {
      this.notificationService.warn('Notas', 'La URL no puede superar los 2048 caracteres.');
      return;
    }

    if (this.links().some((link) => link.url.toLowerCase() === url.toLowerCase())) {
      this.notificationService.warn('Notas', 'Este enlace ya fue agregado.');
      return;
    }

    this.links.update((links) => [...links, { id: crypto.randomUUID(), url }]);
    this.newLinkUrl = '';
  }

  protected removeLink(id: string): void {
    this.confirmService.confirmDelete(NOTES_MESSAGES.CONFIRM_REMOVE_LINK, () => {
      this.links.update((links) => links.filter((link) => link.id !== id));
    });
  }

  private createNote(
    repositoryId: number,
    request: CreateNoteRequest,
    files: File[],
  ): void {
    this.noteFacade
      .create(repositoryId, request, files)
      .pipe(
        finalize(() => {
          this.submitting.set(false);
        }),
      )
      .subscribe({
        next: () => {
          this.notificationService.success('Notas', NOTES_MESSAGES.CREATE_SUCCESS);
          void this.router.navigate(['/notes/repositories', repositoryId]);
        },
        error: (error: HttpErrorResponse) => {
          this.handleLoadError(error);
        },
      });
  }

  private getRepositoryId(): number | null {
    const repositoryId = this.route.snapshot.paramMap.get('repositoryId');

    if (!repositoryId) {
      return null;
    }

    return Number(repositoryId);
  }

  private handleInvalidForm(): void {
    this.notificationService.warn('Notas', UI_MESSAGES.FORM.INVALID_REQUIRED);
  }

  private handleLoadError(error: HttpErrorResponse): void {
    this.notificationService.error(
      'Notas',
      getApiErrorNotificationMessage(error, NOTES_MESSAGES.SAVE_ERROR),
    );
  }

  private handleNoRepository(): void {
    this.notificationService.warn('Notas', NOTES_MESSAGES.REPOSITORY_NOT_FOUND);
    void this.router.navigateByUrl('/');
  }

  private addAttachments(files: File[]): void {
    const validFiles = files.filter((file) => {
      if (file.type.startsWith('image/')) {
        this.notificationService.warn(
          'Notas',
          'Adjunta las imágenes en la sección de imágenes para poder editarlas.',
        );
        return false;
      }

      return this.validateFileSize(file);
    });

    this.appendWithinLimit(validFiles, (accepted) => {
      this.attachmentFiles.update((current) => [...current, ...accepted]);
    });
  }

  private addImages(files: File[]): void {
    const validFiles = files.filter((file) => {
      if (!EDITABLE_IMAGE_TYPES.includes(file.type)) {
        this.notificationService.warn('Notas', 'Solo puedes editar imágenes JPG, PNG o WEBP.');
        return false;
      }

      return this.validateFileSize(file);
    });

    this.appendWithinLimit(validFiles, (accepted) => {
      const drafts = accepted.map((file) => ({
        id: crypto.randomUUID(),
        file,
        previewUrl: URL.createObjectURL(file),
        edited: false,
      }));

      this.images.update((current) => [...current, ...drafts]);
      if (drafts.length > 0) {
        this.imageBeingEdited.set(drafts[0]);
      }
    });
  }

  private appendWithinLimit(files: File[], append: (accepted: File[]) => void): void {
    const available = MAX_NOTE_FILES - this.attachmentFiles().length - this.images().length;
    if (available <= 0) {
      this.notificationService.warn('Notas', 'La nota permite un máximo de 5 archivos e imágenes.');
      return;
    }

    const accepted = files.slice(0, available);
    append(accepted);

    if (files.length > available) {
      this.notificationService.warn(
        'Notas',
        'Solo se agregaron archivos hasta completar el máximo de 5.',
      );
    }
  }

  private validateFileSize(file: File): boolean {
    if (file.size <= MAX_FILE_SIZE) {
      return true;
    }

    this.notificationService.warn('Notas', `El archivo ${file.name} supera el límite de 50 MB.`);
    return false;
  }

  private normalizeUrl(value: string): string {
    const trimmed = value.trim();
    if (!trimmed) {
      return '';
    }

    return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  }

  private isValidUrl(value: string): boolean {
    try {
      const url = new URL(value);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  }
}
