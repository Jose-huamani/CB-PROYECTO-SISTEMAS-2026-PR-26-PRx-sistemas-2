import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';

import { AppPaginationComponent } from '@shared/ui/components/app-pagination/app-pagination.component';
import { NoteFacade } from '@features/notes/application/facades/note.facade';
import { RepositoryFacade } from '@features/repositories/application/facades/repository.facade';
import { AuthFacade } from '@features/auth/application/facades/auth.facade';
import { AppConfirmService } from '@core/services/confirm-dialog.service';
import { NotificationService } from '@core/services/notification.service';
import { NoteModel } from '@features/notes/domain/models/note.model';
import { NoteFileModel } from '@features/notes/domain/models/note-file.model';
import { RepositoryModel } from '@features/repositories/domain/models/repository.model';
import { AppPaginationChange } from '@shared/ui/components/app-pagination/app-pagination.component';
import { getApiErrorNotificationMessage } from '@shared/utils/api-notification.util';
import { NOTES_MESSAGES } from '@features/notes/constants/notes-messages.constants';

@Component({
  selector: 'app-notes-page',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule, SkeletonModule, TagModule, AppPaginationComponent],
  templateUrl: './notes-page.component.html',
  styleUrls: ['./notes-page.component.scss'],
})
export class NotesPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly noteFacade = inject(NoteFacade);
  private readonly repositoryFacade = inject(RepositoryFacade);
  private readonly authFacade = inject(AuthFacade);
  private readonly confirmService = inject(AppConfirmService);
  private readonly notificationService = inject(NotificationService);

  protected readonly notes = this.noteFacade.notes;
  protected readonly repositoryLoading = this.repositoryFacade.loading;
  protected readonly loading = computed(
    () => this.noteFacade.loading() || this.repositoryLoading(),
  ); protected readonly initialized = signal(false); protected readonly actionLoading = this.noteFacade.actionLoading;
  protected readonly repository = signal<RepositoryModel | null>(null);
  protected readonly page = signal(1);
  protected readonly limit = signal(10);
  protected readonly downloadingFileId = signal<number | null>(null);

  protected readonly currentUser = this.authFacade.currentUser;
  protected readonly isIntimateRepository = computed(
    () => !this.route.snapshot.paramMap.has('repositoryId'),
  );

  ngOnInit(): void {
    this.initialized.set(true);
    this.loadNotes();
  }

  protected openCreateNote(): void {
    const repositoryId = this.getRepositoryId();

    if (!repositoryId) {
      void this.router.navigateByUrl('/notes/repositories/me/intimate/create');
      return;
    }

    void this.router.navigate(['/notes/repositories', repositoryId, 'create']);
  }

  protected trackByNoteId(_: number, note: NoteModel): number {
    return note.id;
  }

  protected getNotePreview(note: NoteModel): string {
    return note.content.length > 180 ? `${note.content.slice(0, 180)}...` : note.content;
  }

  protected canDeleteNote(note: NoteModel): boolean {
    const currentUserId = this.currentUser()?.id;

    if (!currentUserId) {
      return false;
    }

    return (
      note.createdBy.id === currentUserId || this.repository()?.ownerUserId === currentUserId
    );
  }

  protected deleteNote(note: NoteModel): void {
    if (!this.canDeleteNote(note)) {
      return;
    }

    this.confirmService.confirmDelete(
      NOTES_MESSAGES.CONFIRM_DELETE.replace('{title}', note.title),
      () => {
        this.noteFacade.deleteById(note.id).subscribe({
          next: () => {
            this.notificationService.success('Notas', NOTES_MESSAGES.DELETE_SUCCESS);
            this.refreshNotes();
          },
          error: (error: HttpErrorResponse) => {
            this.notificationService.error(
              'Notas',
              getApiErrorNotificationMessage(error, NOTES_MESSAGES.LOAD_ERROR),
            );
          },
        });
      },
    );
  }

  protected openCreatorProfile(userId: number): void {
    void this.router.navigate(['/view', userId]);
  }

  protected downloadNoteFile(file: NoteFileModel): void {
    this.downloadingFileId.set(file.id);

    this.noteFacade.downloadFile(file.id).pipe(
      finalize(() => this.downloadingFileId.set(null)),
    ).subscribe({
      next: (response) => {
        const download = response.data;

        if (!download) {
          this.notificationService.warn('Notas', NOTES_MESSAGES.DOWNLOAD_LINK_ERROR);
          return;
        }

        this.openDownloadUrl(download.url, download.fileName);
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.error(
          'Notas',
          getApiErrorNotificationMessage(error, NOTES_MESSAGES.DOWNLOAD_ERROR),
        );
      },
    });
  }

  private openDownloadUrl(url: string, fileName?: string): void {
    const anchor = document.createElement('a');

    anchor.href = url;
    anchor.target = '_blank';
    anchor.rel = 'noopener';

    if (fileName) {
      anchor.download = fileName;
    }

    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }

  protected backToRepository(): void {
    const repositoryId = this.repository()?.id;

    if (repositoryId) {
      void this.router.navigate(['/repositories', repositoryId]);
      return;
    }

    void this.router.navigateByUrl('/');
  }

  protected onAvatarError(event: Event): void {
    (event.target as HTMLImageElement).src = 'logo/prx-logo.png';
  }

  protected get repositoryTitle(): string {
    const repo = this.repository();

    return repo ? `Repositorio: ${repo.name}` : 'Notas';
  }

  protected get repositoryPath(): string {
    const repo = this.repository();

    return repo ? `${repo.owner.username}/${repo.name}` : '';
  }

  private loadNotes(): void {
    const repositoryId = this.getRepositoryId();

    if (!repositoryId) {
      this.loadIntimateRepositoryNotes();
      return;
    }

    this.loadRepository(repositoryId);
  }

  private loadIntimateRepositoryNotes(): void {
    this.repositoryFacade.findMeIntimate().subscribe({
      next: (response) => {
        const repository = response.data;

        if (!repository) {
          this.handleLoadError(new HttpErrorResponse({ status: 404, statusText: 'No encontrado' }));
          return;
        }

        this.repository.set(repository);
        this.findNotes(repository.id);
      },
      error: (error: HttpErrorResponse) => {
        this.handleLoadError(error);
      },
    });
  }

  private loadRepository(repositoryId: number): void {
    this.repositoryFacade.findById(repositoryId).subscribe({
      next: (response) => {
        const repository = response.data;

        if (repository) {
          this.repository.set(repository);
        }

        this.findNotes(repositoryId);
      },
      error: (error: HttpErrorResponse) => {
        this.handleLoadError(error);
      },
    });
  }

  protected getRepositoryColor(): string {
    return `#${this.repository()?.color.replace('#', '')}`;
  }

  private findNotes(repositoryId: number): void {
    this.noteFacade.findByRepository(repositoryId, this.page(), this.limit()).subscribe({
      error: (error: HttpErrorResponse) => {
        this.handleLoadError(error);
      },
    });
  }

  private refreshNotes(): void {
    const repositoryId = this.repository()?.id;

    if (!repositoryId) {
      return;
    }

    this.findNotes(repositoryId);
  }

  protected handlePageChange(event: AppPaginationChange): void {
    this.page.set(event.page + 1);
    this.limit.set(event.rows);
    this.refreshNotes();
  }

  private getRepositoryId(): number | null {
    const repositoryId = this.route.snapshot.paramMap.get('repositoryId');

    if (!repositoryId) {
      return null;
    }

    return Number(repositoryId);
  }

  private handleLoadError(error: HttpErrorResponse): void {
    this.notificationService.error(
      'Notas',
      getApiErrorNotificationMessage(error, NOTES_MESSAGES.LOAD_ERROR),
    );
    void this.router.navigateByUrl('/');
  }
}
