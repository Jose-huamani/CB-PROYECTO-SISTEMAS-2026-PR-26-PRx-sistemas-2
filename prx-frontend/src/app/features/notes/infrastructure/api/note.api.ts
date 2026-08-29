import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseFeatureApi } from '@core/api/base-feature.api';
import { NOTE_API_CONFIG } from '@features/notes/infrastructure/config/note-api.config';
import { NoteApiContract } from '@features/notes/domain/contracts/note-api.contract';
import { ApiResponseModel } from '@shared/models/api-response.model';
import { PaginatedResponseModel } from '@shared/models/paginated-response.model';
import { CreateNoteRequest } from '@features/notes/domain/requests/create-note.request';
import { NoteModel } from '@features/notes/domain/models/note.model';
import { FileDownloadModel } from '@features/files/domain/models/file-download.model';

@Injectable({
  providedIn: 'root',
})
export class NoteApi extends BaseFeatureApi implements NoteApiContract {
  constructor(http: HttpClient) {
    super(http, NOTE_API_CONFIG.base);
  }

  findByRepository(
    repositoryId: number,
    page = 1,
    limit = 10,
  ): Observable<ApiResponseModel<PaginatedResponseModel<NoteModel>>> {
    return this.get<PaginatedResponseModel<NoteModel>>(
      this.buildUrl(
        NOTE_API_CONFIG.endpoints.findByRepository.replace(':repositoryId', repositoryId.toString()),
      ),
      { page, limit },
    );
  }

  create(
    repositoryId: number,
    data: CreateNoteRequest,
    files: File[],
  ): Observable<ApiResponseModel<NoteModel>> {
    const formData = new FormData();

    formData.append('title', data.title);
    formData.append('content', data.content);

    files.forEach((file) => {
      formData.append('files', file, file.name);
    });

    return this.post<NoteModel>(
      this.buildUrl(
        NOTE_API_CONFIG.endpoints.create.replace(':repositoryId', repositoryId.toString()),
      ),
      formData,
    );
  }

  deleteById(id: number): Observable<ApiResponseModel<void>> {
    return this.delete<void>(
      this.buildUrl(NOTE_API_CONFIG.endpoints.deleteById.replace(':id', id.toString())),
    );
  }

  downloadFile(id: number): Observable<ApiResponseModel<FileDownloadModel>> {
    return this.get<FileDownloadModel>(
      this.buildUrl(NOTE_API_CONFIG.endpoints.downloadFile.replace(':id', id.toString())),
    );
  }
}
