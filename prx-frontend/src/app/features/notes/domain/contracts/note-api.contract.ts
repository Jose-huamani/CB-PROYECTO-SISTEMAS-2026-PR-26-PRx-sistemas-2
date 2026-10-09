import { Observable } from 'rxjs';

import { ApiResponseModel } from '@shared/models/api-response.model';
import { CreateNoteRequest } from '@features/notes/domain/requests/create-note.request';
import { NoteModel } from '@features/notes/domain/models/note.model';
import { PaginatedResponseModel } from '@shared/models/paginated-response.model';
import { FileDownloadModel } from '@features/files/domain/models/file-download.model';
import { UpdateNoteRequest } from '@features/notes/domain/requests/update-note.request';

export abstract class NoteApiContract {
    abstract findByRepository(
        repositoryId: number,
        page: number,
        limit: number,
    ): Observable<ApiResponseModel<PaginatedResponseModel<NoteModel>>>;

    abstract create(
        repositoryId: number,
        data: CreateNoteRequest,
        files: File[],
    ): Observable<ApiResponseModel<NoteModel>>;

    abstract findById(id: number): Observable<ApiResponseModel<NoteModel>>;

    abstract update(
        id: number,
        data: UpdateNoteRequest,
        files: File[],
    ): Observable<ApiResponseModel<NoteModel>>;

    abstract deleteById(id: number): Observable<ApiResponseModel<void>>;

    abstract downloadFile(id: number): Observable<ApiResponseModel<FileDownloadModel>>;
}
