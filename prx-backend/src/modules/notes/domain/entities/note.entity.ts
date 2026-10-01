import { AuditableEntity } from '@shared/domain/auditable.entity';
import { NoteFileEntity } from '@modules/notes/domain/entities/note-file.entity';
import { UserEntity } from '@modules/users/domain/entities/user.entity';

export interface NoteTask {
    id: string;
    title: string;
    completed: boolean;
}

export interface NoteLink {
    id: string;
    url: string;
}

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
        public readonly tasks: NoteTask[] = [],
        public readonly links: NoteLink[] = [],
    ) {
        super(id, createdBy, status, createdAt, updatedAt, updatedBy);
    }
}
