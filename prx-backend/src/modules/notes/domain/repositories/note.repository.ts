import { NoteEntity } from '@modules/notes/domain/entities/note.entity';
import { PaginatedResponseDto } from '@shared/application/dto/paginated-response.dto';
import { RepositoryPort } from '@shared/domain/repository.port';

export abstract class NoteRepository extends RepositoryPort<NoteEntity> {
    abstract findById(id: number): Promise<NoteEntity | null>;

    abstract findPaginatedByRepositoryId(
        repositoryId: number,
        page: number,
        limit: number,
    ): Promise<PaginatedResponseDto<NoteEntity>>;

    abstract create(entity: NoteEntity): Promise<NoteEntity>;

    abstract softDelete(id: number, updatedBy: number): Promise<void>;
}
