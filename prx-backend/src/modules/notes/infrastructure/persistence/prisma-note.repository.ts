import { Injectable } from '@nestjs/common';

import { NoteEntity } from '@modules/notes/domain/entities/note.entity';
import { NoteRepository } from '@modules/notes/domain/repositories/note.repository';
import { NotePrismaMapper } from '@modules/notes/infrastructure/mappers/note-prisma.mapper';
import { PaginatedResponseDto } from '@shared/application/dto/paginated-response.dto';
import { BasePrismaRepository } from '@shared/infrastructure/persistence/base-prisma.repository';
import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';

@Injectable()
export class PrismaNoteRepository
    extends BasePrismaRepository
    implements NoteRepository {
    constructor(prisma: PrismaService) {
        super(prisma);
    }

    async findById(id: number): Promise<NoteEntity | null> {
        const note = await this.prisma.note.findFirst({
            where: {
                id,
                status: 1,
            },
            include: {
                noteFiles: {
                    where: { status: 1 },
                },
                createdByUser: true,
            },
        });

        if (!note) {
            return null;
        }

        return NotePrismaMapper.toDomain(note);
    }

    async findPaginatedByRepositoryId(
        repositoryId: number,
        page: number,
        limit: number,
    ): Promise<PaginatedResponseDto<NoteEntity>> {
        const skip = (page - 1) * limit;

        const [total, notes] = await Promise.all([
            this.prisma.note.count({
                where: {
                    repositoryId,
                    status: 1,
                },
            }),
            this.prisma.note.findMany({
                where: {
                    repositoryId,
                    status: 1,
                },
                include: {
                    noteFiles: {
                        where: { status: 1 },
                    },
                    createdByUser: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
                skip,
                take: limit,
            }),
        ]);

        return {
            items: NotePrismaMapper.toDomainList(notes),
            total,
            page,
            limit,
        };
    }

    async create(entity: NoteEntity): Promise<NoteEntity> {
        const created = await this.prisma.note.create({
            data: {
                repositoryId: entity.repositoryId,
                title: entity.title,
                content: entity.content,
                createdBy: entity.createdBy,
            },
            include: {
                noteFiles: {
                    where: { status: 1 },
                },
                createdByUser: true,
            },
        });

        return NotePrismaMapper.toDomain(created);
    }

    async update(id: number, data: Partial<NoteEntity>): Promise<NoteEntity> {
        const updated = await this.prisma.note.update({
            where: { id },
            data: {
                title: data.title,
                content: data.content,
                updatedBy: data.updatedBy,
                status: data.status,
            },
            include: {
                noteFiles: {
                    where: { status: 1 },
                },
                createdByUser: true,
            },
        });

        return NotePrismaMapper.toDomain(updated);
    }

    async softDelete(id: number, updatedBy: number): Promise<void> {
        await this.prisma.note.update({
            where: { id },
            data: {
                status: 0,
                updatedBy: updatedBy,
            },
        });
    }
}
