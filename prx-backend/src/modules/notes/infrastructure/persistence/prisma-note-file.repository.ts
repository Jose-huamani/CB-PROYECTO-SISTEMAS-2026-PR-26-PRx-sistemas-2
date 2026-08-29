import { Injectable } from '@nestjs/common';

import { NoteFileEntity } from '@modules/notes/domain/entities/note-file.entity';
import { NoteFileRepository } from '@modules/notes/domain/repositories/note-file.repository';
import { NoteFilePrismaMapper } from '@modules/notes/infrastructure/mappers/note-file-prisma.mapper';
import { BasePrismaRepository } from '@shared/infrastructure/persistence/base-prisma.repository';
import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';

@Injectable()
export class PrismaNoteFileRepository
    extends BasePrismaRepository
    implements NoteFileRepository {
    constructor(prisma: PrismaService) {
        super(prisma);
    }

    async create(entity: NoteFileEntity): Promise<NoteFileEntity> {
        const created = await this.prisma.noteFile.create({
            data: {
                noteId: entity.noteId,
                name: entity.name,
                storagePath: entity.storagePath,
                createdBy: entity.createdBy,
            },
        });

        return NoteFilePrismaMapper.toDomain(created);
    }

    // Basic implementations for common repository operations
    async findById(id: number): Promise<NoteFileEntity | null> {
        const file = await this.prisma.noteFile.findFirst({
            where: { id, status: 1 },
        });

        if (!file) return null;

        return NoteFilePrismaMapper.toDomain(file);
    }

    async update(id: number, data: Partial<NoteFileEntity>): Promise<NoteFileEntity> {
        const updated = await this.prisma.noteFile.update({
            where: { id },
            data: {
                name: data.name,
                storagePath: data.storagePath,
                updatedBy: data.updatedBy,
                status: data.status,
            },
        });

        return NoteFilePrismaMapper.toDomain(updated);
    }

    async softDelete(id: number, updatedBy: number): Promise<void> {
        await this.prisma.noteFile.update({
            where: { id },
            data: { status: 0, updatedBy },
        });
    }
}
