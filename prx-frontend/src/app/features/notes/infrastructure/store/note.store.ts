import { Injectable, computed, signal } from '@angular/core';

import { NoteModel } from '@features/notes/domain/models/note.model';
import { PaginatedResponseModel } from '@shared/models/paginated-response.model';

@Injectable({
  providedIn: 'root',
})
export class NoteStore {
  private readonly notesSignal = signal<PaginatedResponseModel<NoteModel> | null>(null);
  private readonly noteSignal = signal<NoteModel | null>(null);
  private readonly errorSignal = signal<string | null>(null);
  private readonly loadingSignal = signal(false);
  private readonly actionLoadingSignal = signal(false);

  readonly notes = computed(() => this.notesSignal());
  readonly note = computed(() => this.noteSignal());
  readonly loading = computed(() => this.loadingSignal());
  readonly actionLoading = computed(() => this.actionLoadingSignal());
  readonly error = computed(() => this.errorSignal());

  setNotes(notes: PaginatedResponseModel<NoteModel> | null): void {
    this.notesSignal.set(notes);
  }

  setNote(note: NoteModel | null): void {
    this.noteSignal.set(note);
  }

  setError(error: string | null): void {
    this.errorSignal.set(error);
  }

  setLoading(value: boolean): void {
    this.loadingSignal.set(value);
  }

  setActionLoading(value: boolean): void {
    this.actionLoadingSignal.set(value);
  }

  clearNotes(): void {
    this.notesSignal.set(null);
    this.noteSignal.set(null);
    this.errorSignal.set(null);
    this.actionLoadingSignal.set(false);
  }

  clear(): void {
    this.notesSignal.set(null);
    this.noteSignal.set(null);
    this.errorSignal.set(null);
    this.actionLoadingSignal.set(false);
  }
}
