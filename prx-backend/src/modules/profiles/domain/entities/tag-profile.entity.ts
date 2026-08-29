import { TagEntity } from '@modules/tags/domain/entities/tag.entity';
import { AuditableEntity } from '@shared/domain/auditable.entity';

export class TagProfileEntity extends AuditableEntity {
    constructor(
        id: number | null,
        public readonly profileId: number,
        public readonly tagId: number,
        createdBy: number,
        status?: number,
        createdAt?: Date,
        updatedAt?: Date,
        updatedBy?: number,
        public readonly tag?: TagEntity,
    ) {
        super(id, createdBy, status, createdAt, updatedAt, updatedBy);
    }
}
