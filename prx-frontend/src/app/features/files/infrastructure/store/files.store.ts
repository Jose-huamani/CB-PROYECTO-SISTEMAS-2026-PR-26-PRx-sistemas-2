import { Injectable, computed, signal } from '@angular/core';

import { ExplorerContentModel } from '@features/files/domain/models/explorer-content.model';

@Injectable({
  providedIn: 'root',
})
export class FilesStore {
  private readonly explorerContentSignal = signal<ExplorerContentModel | null>(null);
  private readonly currentFolderIdSignal = signal<number | null>(null);
  private readonly searchSignal = signal<string>('');
  private readonly loadingSignal = signal(false);
  private readonly actionLoadingSignal = signal(false);

  readonly explorerContent = computed(() => this.explorerContentSignal());
  readonly currentFolderId = computed(() => this.currentFolderIdSignal());
  readonly search = computed(() => this.searchSignal());
  readonly loading = computed(() => this.loadingSignal());
  readonly actionLoading = computed(() => this.actionLoadingSignal());

  setExplorerContent(content: ExplorerContentModel | null): void {
    this.explorerContentSignal.set(content);
  }

  setCurrentFolderId(folderId: number | null): void {
    this.currentFolderIdSignal.set(folderId);
  }

  setSearch(search: string): void {
    this.searchSignal.set(search);
  }

  setLoading(value: boolean): void {
    this.loadingSignal.set(value);
  }

  setActionLoading(value: boolean): void {
    this.actionLoadingSignal.set(value);
  }

  clearExplorerContent(): void {
    this.explorerContentSignal.set(null);
    this.currentFolderIdSignal.set(null);
    this.searchSignal.set('');
    this.loadingSignal.set(false);
    this.actionLoadingSignal.set(false);
  }

  clear(): void {
    this.explorerContentSignal.set(null);
    this.currentFolderIdSignal.set(null);
    this.searchSignal.set('');
    this.loadingSignal.set(false);
    this.actionLoadingSignal.set(false);
  }
}
