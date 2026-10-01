import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, forkJoin, map, of, switchMap } from 'rxjs';

import { NotificationService } from '@core/services/notification.service';
import { AuthFacade } from '@features/auth/application/facades/auth.facade';
import { NoteFacade } from '@features/notes/application/facades/note.facade';
import { NOTES_MESSAGES } from '@features/notes/constants/notes-messages.constants';
import { NoteFileModel } from '@features/notes/domain/models/note-file.model';
import { NoteLinkModel, NoteModel, NoteTaskModel } from '@features/notes/domain/models/note.model';
import { NoteImageEditorComponent } from '@features/notes/presentation/components/note-image-editor/note-image-editor.component';
import { RepositoryFacade } from '@features/repositories/application/facades/repository.facade';
import { RepositoryModel } from '@features/repositories/domain/models/repository.model';
import { getApiErrorNotificationMessage } from '@shared/utils/api-notification.util';
import { AppConfirmService } from '@core/services/confirm-dialog.service';

interface ExistingFileView extends NoteFileModel {
  url?: string;
  isImage: boolean;
}

interface ImageDraft {
  id: string;
  file: File;
  previewUrl: string;
  edited: boolean;
  sourceFileId?: number;
}

const MAX_NOTE_FILES = 5;
const MAX_FILE_SIZE = 50 * 1024 * 1024;
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

@Component({
  selector: 'app-note-detail-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NoteImageEditorComponent],
  templateUrl: './note-detail-page.component.html',
  styleUrl: './note-detail-page.component.scss',
})
export class NoteDetailPageComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly noteFacade = inject(NoteFacade);
  private readonly repositoryFacade = inject(RepositoryFacade);
  private readonly authFacade = inject(AuthFacade);
  private readonly notifications = inject(NotificationService);
  private readonly confirmService = inject(AppConfirmService);

  protected readonly note = signal<NoteModel | null>(null);
  protected readonly repository = signal<RepositoryModel | null>(null);
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly editing = signal(false);
  protected readonly existingFiles = signal<ExistingFileView[]>([]);
  protected readonly newAttachments = signal<File[]>([]);
  protected readonly newImages = signal<ImageDraft[]>([]);
  protected readonly imageBeingEdited = signal<ImageDraft | null>(null);
  protected readonly tasks = signal<NoteTaskModel[]>([]);
  protected readonly links = signal<NoteLinkModel[]>([]);
  protected readonly completedTaskCount = computed(
    () => this.tasks().filter((task) => task.completed).length,
  );
  protected newTaskTitle = '';
  protected newLinkUrl = '';

  protected readonly form = new FormGroup({
    title: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(150)] }),
    content: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(65535)] }),
  });

  protected readonly canEdit = computed(() => {
    const repository = this.repository();
    const userId = this.authFacade.currentUser()?.id;
    return !!repository && !!userId &&
      (repository.ownerUserId === userId || !!repository.currentUserRepository);
  });

  ngOnInit(): void {
    const noteId = Number(this.route.snapshot.paramMap.get('noteId'));
    if (!Number.isInteger(noteId)) {
      this.back();
      return;
    }

    this.noteFacade.findById(noteId).pipe(
      switchMap((response) => {
        const note = response.data;
        if (!note) throw new Error('NOTE_NOT_FOUND');
        this.setNote(note);
        return this.repositoryFacade.findById(note.repositoryId);
      }),
      finalize(() => this.loading.set(false)),
    ).subscribe({
      next: (response) => {
        if (response.data) this.repository.set(response.data);
        this.loadFileUrls();
      },
      error: (error: HttpErrorResponse) => {
        this.notifications.error('Notas', getApiErrorNotificationMessage(error, NOTES_MESSAGES.LOAD_ERROR));
        this.back();
      },
    });
  }

  ngOnDestroy(): void {
    this.newImages().forEach((image) => URL.revokeObjectURL(image.previewUrl));
  }

  protected startEditing(): void {
    if (this.canEdit()) this.editing.set(true);
  }

  protected cancelEditing(): void {
    const note = this.note();
    if (!note) return;
    this.form.setValue({ title: note.title, content: note.content });
    this.tasks.set(note.tasks ?? []);
    this.links.set(note.links ?? []);
    this.newLinkUrl = '';
    this.newAttachments.set([]);
    this.newImages().forEach((image) => URL.revokeObjectURL(image.previewUrl));
    this.newImages.set([]);
    this.existingFiles.set(note.files.map((file) => ({
      ...file,
      isImage: this.isImageName(file.name),
      url: this.existingFiles().find((item) => item.id === file.id)?.url,
    })));
    this.editing.set(false);
  }

  protected save(): void {
    const title = this.form.controls.title.value.trim();
    const content = this.form.controls.content.value.trim();
    if (!this.canEdit() || this.form.invalid || !title || !content || this.saving()) {
      this.form.markAllAsTouched();
      if (!title || !content) this.notifications.warn('Notas', NOTES_MESSAGES.REQUIRED_FIELDS);
      return;
    }
    this.confirmService.confirm({
      header: 'Guardar cambios',
      message: NOTES_MESSAGES.CONFIRM_SAVE_CHANGES,
      icon: 'pi pi-save',
      acceptLabel: 'Guardar',
      rejectLabel: 'Cancelar',
      accept: () => this.persist(true),
    });
  }

  protected addTask(): void {
    const title = this.newTaskTitle.trim();
    if (!title) {
      this.notifications.warn('Notas', 'Escribe el título de la tarea.');
      return;
    }
    if (title.length > 200) {
      this.notifications.warn('Notas', 'El título de la tarea no puede superar los 200 caracteres.');
      return;
    }
    this.tasks.update((tasks) => [...tasks, { id: crypto.randomUUID(), title, completed: false }]);
    this.newTaskTitle = '';
  }

  protected removeTask(id: string): void {
    const task = this.tasks().find((item) => item.id === id);
    if (!task) return;
    this.confirmService.confirmDelete(
      NOTES_MESSAGES.CONFIRM_REMOVE_TASK.replace('{title}', task.title),
      () => this.tasks.update((tasks) => tasks.filter((item) => item.id !== id)),
    );
  }

  protected addLink(): void {
    const url = this.normalizeUrl(this.newLinkUrl);
    if (!url) {
      this.notifications.warn('Notas', 'Ingresa una URL.');
      return;
    }
    if (!this.isValidUrl(url)) {
      this.notifications.warn('Notas', 'Ingresa una URL válida.');
      return;
    }
    if (url.length > 2048) {
      this.notifications.warn('Notas', 'La URL no puede superar los 2048 caracteres.');
      return;
    }
    if (this.links().some((link) => link.url.toLowerCase() === url.toLowerCase())) {
      this.notifications.warn('Notas', 'Este enlace ya fue agregado.');
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

  protected toggleTask(task: NoteTaskModel): void {
    if (!this.canEdit() || this.saving()) return;
    this.tasks.update((tasks) => tasks.map((item) => item.id === task.id ? { ...item, completed: !item.completed } : item));
    if (!this.editing()) this.persist(false);
  }

  protected selectAttachments(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.appendFiles(Array.from(input.files ?? []).filter((file) => !file.type.startsWith('image/')), false);
    input.value = '';
  }

  protected selectImages(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.appendFiles(Array.from(input.files ?? []).filter((file) => IMAGE_TYPES.includes(file.type)), true);
    input.value = '';
  }

  protected removeExistingFile(id: number): void {
    const file = this.existingFiles().find((item) => item.id === id);
    if (!file) return;
    this.confirmService.confirmDelete(
      NOTES_MESSAGES.CONFIRM_REMOVE_FILE.replace('{name}', file.name),
      () => this.existingFiles.update((files) => files.filter((item) => item.id !== id)),
    );
  }

  protected removeAttachment(index: number): void {
    const file = this.newAttachments()[index];
    if (!file) return;
    this.confirmService.confirmDelete(
      NOTES_MESSAGES.CONFIRM_REMOVE_FILE.replace('{name}', file.name),
      () => this.newAttachments.update((files) => files.filter((_, current) => current !== index)),
    );
  }

  protected removeImage(id: string): void {
    const image = this.newImages().find((item) => item.id === id);
    if (!image) return;
    this.confirmService.confirmDelete(
      NOTES_MESSAGES.CONFIRM_REMOVE_IMAGE.replace('{name}', image.file.name),
      () => {
        URL.revokeObjectURL(image.previewUrl);
        this.newImages.update((images) => images.filter((item) => item.id !== id));
      },
    );
  }

  protected editNewImage(image: ImageDraft): void {
    this.imageBeingEdited.set(image);
  }

  protected async editExistingImage(file: ExistingFileView): Promise<void> {
    if (!file.url) return;
    try {
      const response = await fetch(file.url);
      const blob = await response.blob();
      const draft: ImageDraft = {
        id: crypto.randomUUID(),
        file: new File([blob], file.name, { type: blob.type || 'image/png' }),
        previewUrl: file.url,
        edited: false,
        sourceFileId: file.id,
      };
      this.imageBeingEdited.set(draft);
    } catch {
      this.notifications.error('Notas', 'No se pudo preparar la imagen para editarla.');
    }
  }

  protected saveEditedImage(file: File): void {
    const current = this.imageBeingEdited();
    if (!current) return;
    if (!current.sourceFileId) URL.revokeObjectURL(current.previewUrl);
    const updated = { ...current, file, previewUrl: URL.createObjectURL(file), edited: true, sourceFileId: undefined };
    if (current.sourceFileId) {
      this.existingFiles.update((files) => files.filter((item) => item.id !== current.sourceFileId));
      this.newImages.update((images) => [...images, updated]);
    } else {
      this.newImages.update((images) => images.map((image) => image.id === current.id ? updated : image));
    }
    this.imageBeingEdited.set(null);
  }

  protected closeImageEditor(): void {
    this.imageBeingEdited.set(null);
  }

  protected download(file: ExistingFileView): void {
    if (file.url) window.open(file.url, '_blank', 'noopener');
  }

  protected back(): void {
    const repositoryId = this.route.snapshot.paramMap.get('repositoryId');
    if (repositoryId) {
      void this.router.navigate(['/notes/repositories', repositoryId]);
      return;
    }
    void this.router.navigateByUrl('/notes/repositories/me/intimate');
  }

  private persist(closeEditor: boolean): void {
    const note = this.note();
    if (!note) return;
    this.saving.set(true);
    const files = [...this.newAttachments(), ...this.newImages().map((image) => image.file)];
    this.noteFacade.update(note.id, {
      title: this.form.controls.title.value.trim(),
      content: this.form.controls.content.value.trim(),
      tasks: this.tasks(),
      links: this.links(),
      retainedFileIds: this.existingFiles().map((file) => file.id),
    }, files).pipe(finalize(() => this.saving.set(false))).subscribe({
      next: (response) => {
        if (response.data) this.setNote(response.data);
        this.newAttachments.set([]);
        this.newImages().forEach((image) => URL.revokeObjectURL(image.previewUrl));
        this.newImages.set([]);
        if (closeEditor) {
          this.editing.set(false);
          this.notifications.success('Notas', NOTES_MESSAGES.UPDATE_SUCCESS);
        }
        this.loadFileUrls();
      },
      error: (error: HttpErrorResponse) => {
        this.notifications.error('Notas', getApiErrorNotificationMessage(error, NOTES_MESSAGES.SAVE_ERROR));
        this.setNote(note);
      },
    });
  }

  private setNote(note: NoteModel): void {
    const normalized = { ...note, tasks: note.tasks ?? [] };
    this.note.set(normalized);
    this.form.setValue({ title: note.title, content: note.content });
    this.tasks.set(normalized.tasks);
    this.links.set(note.links ?? []);
    this.existingFiles.set(note.files.map((file) => ({ ...file, isImage: this.isImageName(file.name) })));
  }

  private loadFileUrls(): void {
    const files = this.existingFiles();
    if (!files.length) return;
    forkJoin(files.map((file) => this.noteFacade.downloadFile(file.id).pipe(
      map((response) => ({ id: file.id, url: response.data?.url })),
    ))).subscribe({
      next: (urls) => this.existingFiles.update((items) => items.map((item) => ({
        ...item,
        url: urls.find((entry) => entry.id === item.id)?.url,
      }))),
      error: () => of(null),
    });
  }

  private appendFiles(files: File[], images: boolean): void {
    const valid = files.filter((file) => file.size <= MAX_FILE_SIZE);
    const available = MAX_NOTE_FILES - this.existingFiles().length - this.newAttachments().length - this.newImages().length;
    const accepted = valid.slice(0, Math.max(0, available));
    if (accepted.length < files.length) this.notifications.warn('Notas', 'Sólo se admiten 5 archivos de hasta 50 MB.');
    if (images) {
      const drafts = accepted.map((file) => ({
        id: crypto.randomUUID(), file, previewUrl: URL.createObjectURL(file), edited: false,
      }));
      this.newImages.update((current) => [...current, ...drafts]);
      if (drafts[0]) this.imageBeingEdited.set(drafts[0]);
      return;
    }
    this.newAttachments.update((current) => [...current, ...accepted]);
  }

  private isImageName(name: string): boolean {
    return /\.(jpe?g|png|webp)$/i.test(name);
  }

  private normalizeUrl(value: string): string {
    const trimmed = value.trim();
    if (!trimmed) return '';
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
