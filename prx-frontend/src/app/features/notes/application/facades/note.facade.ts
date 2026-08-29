import { Injectable, inject } from '@angular/core';
import { finalize, Observable, tap } from 'rxjs';

import { NoteApi } from '@features/notes/infrastructure/api/note.api';
import { NoteStore } from '@features/notes/infrastructure/store/note.store';
import { ApiResponseModel } from '@shared/models/api-response.model';
import { PaginatedResponseModel } from '@shared/models/paginated-response.model';
import { CreateNoteRequest } from '@features/notes/domain/requests/create-note.request';
import { NoteModel } from '@features/notes/domain/models/note.model';
import { FileDownloadModel } from '@features/files/domain/models/file-download.model';

@Injectable({
  providedIn: 'root',
})
export class NoteFacade {
  private readonly noteApi = inject(NoteApi);
  private readonly noteStore = inject(NoteStore);

  readonly notes = this.noteStore.notes;
  readonly note = this.noteStore.note;
  readonly loading = this.noteStore.loading;
  readonly actionLoading = this.noteStore.actionLoading;
  readonly error = this.noteStore.error;

  findByRepository(
    repositoryId: number,
    page: number,
    limit: number,
  ): Observable<ApiResponseModel<PaginatedResponseModel<NoteModel>>> {
    this.noteStore.setLoading(true);

    return this.noteApi.findByRepository(repositoryId, page, limit).pipe(
      tap((response) => {
        const rawData = response.data as
          | PaginatedResponseModel<NoteModel>
          | NoteModel[]
          | undefined;

        const items = Array.isArray(rawData) ? rawData : rawData?.items ?? [];
        const total = Array.isArray(rawData)
          ? items.length
          : rawData?.total ?? 0;
        const currentPage = Array.isArray(rawData)
          ? page
          : rawData?.page ?? page;
        const currentLimit = Array.isArray(rawData)
          ? limit
          : rawData?.limit ?? limit;

        this.noteStore.setNotes({
          items,
          total,
          page: currentPage,
          limit: currentLimit,
        });
      }),
      finalize(() => {
        this.noteStore.setLoading(false);
      }),
    );
  }

  create(
    repositoryId: number,
    data: CreateNoteRequest,
    files: File[],
  ): Observable<ApiResponseModel<NoteModel>> {
    return this.executeWithActionLoading(this.noteApi.create(repositoryId, data, files));
  }

  deleteById(id: number): Observable<ApiResponseModel<void>> {
    return this.executeWithActionLoading(
      this.noteApi.deleteById(id).pipe(
        tap(() => {
          if (this.noteStore.note()?.id === id) {
            this.noteStore.setNote(null);
          }
        }),
      ),
    );
  }

  downloadFile(id: number): Observable<ApiResponseModel<FileDownloadModel>> {
    return this.executeWithActionLoading(this.noteApi.downloadFile(id));
  }

  clearNotes(): void {
    this.noteStore.clearNotes();
  }

  private executeWithActionLoading<T>(source$: Observable<T>): Observable<T> {
    this.noteStore.setActionLoading(true);

    return source$.pipe(
      finalize(() => {
        this.noteStore.setActionLoading(false);
      }),
    );
  }
}
