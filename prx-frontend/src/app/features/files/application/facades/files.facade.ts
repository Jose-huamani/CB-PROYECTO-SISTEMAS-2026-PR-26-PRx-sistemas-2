import { Injectable, inject } from '@angular/core';
import { Observable, finalize, tap } from 'rxjs';

import { ExplorerContentModel } from '@features/files/domain/models/explorer-content.model';
import { FileDownloadModel } from '@features/files/domain/models/file-download.model';
import { FileModel } from '@features/files/domain/models/file.model';
import { FolderModel } from '@features/files/domain/models/folder.model';
import { CreateFileRequest } from '@features/files/domain/requests/create-file.request';
import { CreateFolderRequest } from '@features/files/domain/requests/create-folder.request';
import { GetExplorerContentRequest } from '@features/files/domain/requests/get-explorer-content.request';
import { UpdateFolderRequest } from '@features/files/domain/requests/update-folder.request';
import { FilesApi } from '@features/files/infrastructure/api/files.api';
import { FilesStore } from '@features/files/infrastructure/store/files.store';
import { ApiResponseModel } from '@shared/models/api-response.model';
import { resolvePublicStorageUrl } from '@shared/utils/storage-url.util';

@Injectable({
  providedIn: 'root',
})
export class FilesFacade {
  private readonly filesApi = inject(FilesApi);
  private readonly filesStore = inject(FilesStore);

  readonly explorerContent = this.filesStore.explorerContent;
  readonly currentFolderId = this.filesStore.currentFolderId;
  readonly search = this.filesStore.search;
  readonly loading = this.filesStore.loading;
  readonly actionLoading = this.filesStore.actionLoading;

  findExplorerContent(
    repositoryId: number,
    data: GetExplorerContentRequest,
  ): Observable<ApiResponseModel<ExplorerContentModel>> {
    this.filesStore.setLoading(true);

    return this.filesApi.findExplorerContent(repositoryId, data).pipe(
      tap((response) => {
        const explorerContent = response.data;

        if (!explorerContent) {
          this.filesStore.setExplorerContent(null);
          return;
        }

        this.filesStore.setExplorerContent(this.mapExplorerContent(explorerContent));
        this.filesStore.setCurrentFolderId(data.folderId ?? null);
        this.filesStore.setSearch(data.search ?? '');
      }),
      finalize(() => {
        this.filesStore.setLoading(false);
      }),
    );
  }

  createFolder(data: CreateFolderRequest): Observable<ApiResponseModel<FolderModel>> {
    return this.executeWithActionLoading(this.filesApi.createFolder(data));
  }

  updateFolder(id: number, data: UpdateFolderRequest): Observable<ApiResponseModel<FolderModel>> {
    return this.executeWithActionLoading(this.filesApi.updateFolder(id, data));
  }

  deleteFolder(id: number): Observable<ApiResponseModel<void>> {
    return this.executeWithActionLoading(this.filesApi.deleteFolder(id));
  }

  createFile(data: CreateFileRequest): Observable<ApiResponseModel<FileModel>> {
    return this.executeWithActionLoading(this.filesApi.createFile(data));
  }

  downloadFile(id: number): Observable<ApiResponseModel<FileDownloadModel>> {
    return this.executeWithActionLoading(this.filesApi.downloadFile(id));
  }

  deleteFile(id: number): Observable<ApiResponseModel<void>> {
    return this.executeWithActionLoading(this.filesApi.deleteFile(id));
  }

  setCurrentFolderId(folderId: number | null): void {
    this.filesStore.setCurrentFolderId(folderId);
  }

  setSearch(search: string): void {
    this.filesStore.setSearch(search);
  }

  clearExplorerContent(): void {
    this.filesStore.clearExplorerContent();
  }

  reset(): void {
    this.filesStore.clear();
  }

  private mapExplorerContent(content: ExplorerContentModel): ExplorerContentModel {
    return {
      ...content,
      folders: content.folders.map((folder) => this.mapFolder(folder)),
      files: content.files.map((file) => this.mapFile(file)),
    };
  }

  private mapFolder(folder: FolderModel): FolderModel {
    return {
      ...folder,
      creator: {
        ...folder.creator,
        avatarUrl: resolvePublicStorageUrl(folder.creator.avatarUrl),
      },
    };
  }

  private mapFile(file: FileModel): FileModel {
    return {
      ...file,
      creator: {
        ...file.creator,
        avatarUrl: resolvePublicStorageUrl(file.creator.avatarUrl),
      },
    };
  }

  private executeWithActionLoading<T>(source$: Observable<T>): Observable<T> {
    this.filesStore.setActionLoading(true);

    return source$.pipe(
      finalize(() => {
        this.filesStore.setActionLoading(false);
      }),
    );
  }
}
