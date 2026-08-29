import { Observable } from 'rxjs';

import { ExplorerContentModel } from '@features/files/domain/models/explorer-content.model';
import { FileDownloadModel } from '@features/files/domain/models/file-download.model';
import { FileModel } from '@features/files/domain/models/file.model';
import { FolderModel } from '@features/files/domain/models/folder.model';
import { CreateFileRequest } from '@features/files/domain/requests/create-file.request';
import { CreateFolderRequest } from '@features/files/domain/requests/create-folder.request';
import { GetExplorerContentRequest } from '@features/files/domain/requests/get-explorer-content.request';
import { UpdateFolderRequest } from '@features/files/domain/requests/update-folder.request';
import { ApiResponseModel } from '@shared/models/api-response.model';

export abstract class FilesApiContract {
  abstract findExplorerContent(
    repositoryId: number,
    data: GetExplorerContentRequest,
  ): Observable<ApiResponseModel<ExplorerContentModel>>;

  abstract createFile(data: CreateFileRequest): Observable<ApiResponseModel<FileModel>>;

  abstract downloadFile(id: number): Observable<ApiResponseModel<FileDownloadModel>>;

  abstract deleteFile(id: number): Observable<ApiResponseModel<void>>;

  abstract createFolder(data: CreateFolderRequest): Observable<ApiResponseModel<FolderModel>>;

  abstract updateFolder(
    id: number,
    data: UpdateFolderRequest,
  ): Observable<ApiResponseModel<FolderModel>>;

  abstract deleteFolder(id: number): Observable<ApiResponseModel<void>>;
}
