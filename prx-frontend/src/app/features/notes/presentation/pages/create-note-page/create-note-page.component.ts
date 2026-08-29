import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
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

interface CreateNoteFormModel {
  title: string;
  content: string;
  files: File[] | null;
}

@Component({
  selector: 'app-create-note-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormlyModule, ButtonModule, CardModule],
  templateUrl: './create-note-page.component.html',
  styleUrl: './create-note-page.component.scss',
})
export class CreateNotePageComponent {
  private readonly noteFacade = inject(NoteFacade);
  private readonly repositoryFacade = inject(RepositoryFacade);
  private readonly notificationService = inject(NotificationService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly form = new FormGroup({});
  protected readonly fields: FormlyFieldConfig[] = buildCreateNoteFormFields();
  protected readonly submitting = signal(false);

  protected model: CreateNoteFormModel = {
    title: '',
    content: '',
    files: null,
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

    const request: CreateNoteRequest = {
      title: value.title,
      content: value.content,
    };

    const files = value.files ?? [];
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
}
