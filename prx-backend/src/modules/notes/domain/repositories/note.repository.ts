import { NoteEntity } from '@modules/notes/domain/entities/note.entity';
import { PaginatedResponseDto } from '@shared/application/dto/paginated-response.dto';
import { RepositoryPort } from '@shared/domain/repository.port';

export interface NoteAttachment {
    name: string;
    storagePath: string;
    createdBy: number;
}

export abstract class NoteRepository extends RepositoryPort<NoteEntity> {
    abstract findById(id: number): Promise<NoteEntity | null>;

    abstract findActiveByRepositoryIdAndTitle(
        repositoryId: number,
        title: string,
        excludeId?: number,
    ): Promise<NoteEntity | null>;

    abstract findPaginatedByRepositoryId(
        repositoryId: number,
        page: number,
        limit: number,
    ): Promise<PaginatedResponseDto<NoteEntity>>;

    abstract create(entity: NoteEntity): Promise<NoteEntity>;

    abstract createWithFiles(entity: NoteEntity, files: NoteAttachment[]): Promise<NoteEntity>;

    abstract updateWithFiles(
        id: number,
        data: Partial<NoteEntity>,
        retainedFileIds: number[],
        files: NoteAttachment[],
    ): Promise<NoteEntity>;

    abstract softDelete(id: number, updatedBy: number): Promise<void>;
}
