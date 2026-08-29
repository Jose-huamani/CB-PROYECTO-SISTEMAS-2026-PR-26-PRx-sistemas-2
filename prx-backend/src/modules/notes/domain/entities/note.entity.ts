import { AuditableEntity } from '@shared/domain/auditable.entity';
import { NoteFileEntity } from '@modules/notes/domain/entities/note-file.entity';
import { UserEntity } from '@modules/users/domain/entities/user.entity';

export class NoteEntity extends AuditableEntity {
    constructor(
        id: number | null,
        public readonly repositoryId: number,
        public readonly title: string,
        public readonly content: string,
        createdBy: number,
        public readonly files: NoteFileEntity[] = [],
        status?: number,
        createdAt?: Date,
        updatedAt?: Date,
        updatedBy?: number,
        public readonly createdByUser?: UserEntity,
    ) {
        super(id, createdBy, status, createdAt, updatedAt, updatedBy);
    }
}
