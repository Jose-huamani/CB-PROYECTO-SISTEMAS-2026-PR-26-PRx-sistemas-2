import { NoteFileEntity } from '@modules/notes/domain/entities/note-file.entity';
import { RepositoryPort } from '@shared/domain/repository.port';

export abstract class NoteFileRepository extends RepositoryPort<NoteFileEntity> {
    abstract create(entity: NoteFileEntity): Promise<NoteFileEntity>;
}
