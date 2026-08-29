import { AuditableEntity } from '@shared/domain/auditable.entity';

export class NoteFileEntity extends AuditableEntity {
    constructor(
        id: number | null,
        public readonly noteId: number,
        public readonly name: string,
        public readonly storagePath: string,
        createdBy: number,
        status?: number,
        createdAt?: Date,
        updatedAt?: Date,
        updatedBy?: number,
    ) {
        super(id, createdBy, status, createdAt, updatedAt, updatedBy);
    }
}
