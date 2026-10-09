import { Injectable } from '@nestjs/common';
import { Prisma } from '@generated-prisma/client';

import { NoteEntity } from '@modules/notes/domain/entities/note.entity';
import { NoteAttachment, NoteRepository } from '@modules/notes/domain/repositories/note.repository';
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

    async findActiveByRepositoryIdAndTitle(
        repositoryId: number,
        title: string,
        excludeId?: number,
    ): Promise<NoteEntity | null> {
        const note = await this.prisma.note.findFirst({
            where: {
                repositoryId,
                title,
                status: 1,
                id: excludeId === undefined ? undefined : { not: excludeId },
            },
            include: {
                noteFiles: { where: { status: 1 } },
                createdByUser: true,
            },
        });

        return note ? NotePrismaMapper.toDomain(note) : null;
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
                tasks: entity.tasks as unknown as Prisma.InputJsonValue,
                links: entity.links as unknown as Prisma.InputJsonValue,
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
                tasks: data.tasks === undefined
                    ? undefined
                    : data.tasks as unknown as Prisma.InputJsonValue,
                links: data.links === undefined
                    ? undefined
                    : data.links as unknown as Prisma.InputJsonValue,
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

    async createWithFiles(entity: NoteEntity, files: NoteAttachment[]): Promise<NoteEntity> {
        return this.prisma.$transaction(async (tx) => {
            const note = await tx.note.create({
                data: {
                    repositoryId: entity.repositoryId,
                    title: entity.title,
                    content: entity.content,
                    tasks: entity.tasks as unknown as Prisma.InputJsonValue,
                    links: entity.links as unknown as Prisma.InputJsonValue,
                    createdBy: entity.createdBy,
                    noteFiles: { create: files },
                },
                include: { noteFiles: { where: { status: 1 } }, createdByUser: true },
            });
            await tx.repository.updateMany({
                where: { id: entity.repositoryId, status: 1 },
                data: { updatedAt: new Date() },
            });
            return NotePrismaMapper.toDomain(note);
        });
    }

    async updateWithFiles(
        id: number,
        data: Partial<NoteEntity>,
        retainedFileIds: number[],
        files: NoteAttachment[],
    ): Promise<NoteEntity> {
        return this.prisma.$transaction(async (tx) => {
            await tx.noteFile.updateMany({
                where: { noteId: id, status: 1, id: { notIn: retainedFileIds } },
                data: { status: 0, updatedBy: data.updatedBy },
            });
            const note = await tx.note.update({
                where: { id, status: 1 },
                data: {
                    title: data.title,
                    content: data.content,
                    tasks: data.tasks as unknown as Prisma.InputJsonValue,
                    links: data.links as unknown as Prisma.InputJsonValue,
                    updatedBy: data.updatedBy,
                    noteFiles: { create: files },
                },
                include: { noteFiles: { where: { status: 1 } }, createdByUser: true },
            });
            await tx.repository.updateMany({
                where: { id: note.repositoryId, status: 1 },
                data: { updatedAt: new Date() },
            });
            return NotePrismaMapper.toDomain(note);
        });
    }
}
