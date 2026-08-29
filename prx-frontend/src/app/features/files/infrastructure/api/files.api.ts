import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseFeatureApi } from '@core/api/base-feature.api';
import { FilesApiContract } from '@features/files/domain/contracts/files-api.contract';
import { ExplorerContentModel } from '@features/files/domain/models/explorer-content.model';
import { FileDownloadModel } from '@features/files/domain/models/file-download.model';
import { FileModel } from '@features/files/domain/models/file.model';
import { FolderModel } from '@features/files/domain/models/folder.model';
import { CreateFileRequest } from '@features/files/domain/requests/create-file.request';
import { CreateFolderRequest } from '@features/files/domain/requests/create-folder.request';
import { GetExplorerContentRequest } from '@features/files/domain/requests/get-explorer-content.request';
import { UpdateFolderRequest } from '@features/files/domain/requests/update-folder.request';
import { FILES_API_CONFIG } from '@features/files/infrastructure/config/files-api.config';
import { ApiResponseModel } from '@shared/models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class FilesApi extends BaseFeatureApi implements FilesApiContract {
  constructor(http: HttpClient) {
    super(http, FILES_API_CONFIG.base);
  }

  findExplorerContent(
    repositoryId: number,
    data: GetExplorerContentRequest,
  ): Observable<ApiResponseModel<ExplorerContentModel>> {
    return this.get<ExplorerContentModel>(
      this.buildUrl(
        FILES_API_CONFIG.endpoints.findExplorerContent.replace(
          ':repositoryId',
          repositoryId.toString(),
        ),
      ),
      {
        folderId: data.folderId,
        search: data.search,
      },
    );
  }

  createFile(data: CreateFileRequest): Observable<ApiResponseModel<FileModel>> {
    const formData = new FormData();

    formData.append('repositoryId', data.repositoryId.toString());
    formData.append('name', data.name);
    formData.append('file', data.file);

    if (data.folderId) {
      formData.append('folderId', data.folderId.toString());
    }

    if (data.tags?.length) {
      formData.append('tags', JSON.stringify(data.tags.map((name) => ({ name }))));
    }

    return this.post<FileModel>(this.buildUrl(FILES_API_CONFIG.endpoints.createFile), formData);
  }

  downloadFile(id: number): Observable<ApiResponseModel<FileDownloadModel>> {
    return this.get<FileDownloadModel>(
      this.buildUrl(FILES_API_CONFIG.endpoints.downloadFile.replace(':id', id.toString())),
    );
  }

  deleteFile(id: number): Observable<ApiResponseModel<void>> {
    return this.delete<void>(
      this.buildUrl(FILES_API_CONFIG.endpoints.deleteFile.replace(':id', id.toString())),
    );
  }

  createFolder(data: CreateFolderRequest): Observable<ApiResponseModel<FolderModel>> {
    return this.post<FolderModel>(this.buildUrl(FILES_API_CONFIG.endpoints.createFolder), data);
  }

  updateFolder(id: number, data: UpdateFolderRequest): Observable<ApiResponseModel<FolderModel>> {
    return this.patch<FolderModel>(
      this.buildUrl(FILES_API_CONFIG.endpoints.updateFolder.replace(':id', id.toString())),
      data,
    );
  }

  deleteFolder(id: number): Observable<ApiResponseModel<void>> {
    return this.delete<void>(
      this.buildUrl(FILES_API_CONFIG.endpoints.deleteFolder.replace(':id', id.toString())),
    );
  }
}
