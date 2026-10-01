import { BadRequestException, ForbiddenException, Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RepositoryVisibility } from '@generated-prisma/enums';

import { UpdateNoteCommand } from './update-note.command';
import { NoteRepository } from '@modules/notes/domain/repositories/note.repository';
import { NoteFileRepository } from '@modules/notes/domain/repositories/note-file.repository';
import { NoteFileEntity } from '@modules/notes/domain/entities/note-file.entity';
import { NoteLink, NoteTask } from '@modules/notes/domain/entities/note.entity';
import { NoteResponseMapper } from '@modules/notes/application/mappers/note-response.mapper';
import { NOTE_MESSAGES } from '@modules/notes/application/constants/note-messages.constants';
import { RepositoryRepository } from '@modules/repositories/domain/repositories/repository.repository';
import { RepositoryUserRepository } from '@modules/repositories/domain/repositories/repository-user.repository';
import { REPOSITORY_MESSAGES } from '@modules/repositories/application/constants/repository-messages.constants';
import { TigrisStorageService } from '@shared/infrastructure/storage/tigris-storage.service';

@CommandHandler(UpdateNoteCommand)
export class UpdateNoteHandler implements ICommandHandler<UpdateNoteCommand> {
    constructor(
        @Inject(NoteRepository) private readonly noteRepository: NoteRepository,
        @Inject(NoteFileRepository) private readonly noteFileRepository: NoteFileRepository,
        @Inject(RepositoryRepository) private readonly repositoryRepository: RepositoryRepository,
        @Inject(RepositoryUserRepository) private readonly repositoryUserRepository: RepositoryUserRepository,
        private readonly storage: TigrisStorageService,
    ) {}

    async execute(command: UpdateNoteCommand) {
        const note = await this.noteRepository.findById(command.id);
        if (!note) throw new NotFoundException(NOTE_MESSAGES.NOT_FOUND);

        const repository = await this.repositoryRepository.findById(note.repositoryId);
        if (!repository) throw new NotFoundException(REPOSITORY_MESSAGES.NOT_FOUND);

        const isOwner = repository.ownerUserId === command.userId;
        if (repository.visibility === RepositoryVisibility.intimo) {
            if (!isOwner) throw new ForbiddenException(NOTE_MESSAGES.FORBIDDEN);
        } else {
            const membership = await this.repositoryUserRepository.findByRepositoryIdAndUserId(
                note.repositoryId,
                command.userId,
            );
            if (!membership && !isOwner) throw new ForbiddenException(NOTE_MESSAGES.FORBIDDEN);
        }

        const tasks = this.parseTasks(command.dto.tasks);
        const links = this.parseLinks(command.dto.links);
        const title = command.dto.title.trim();
        const duplicate = await this.noteRepository.findActiveByRepositoryIdAndTitle(
            note.repositoryId,
            title,
            command.id,
        );

        if (duplicate) {
            throw new BadRequestException(NOTE_MESSAGES.DUPLICATE_TITLE);
        }
        const retainedIds = new Set(
            (command.dto.retainedFileIds ?? '')
                .split(',')
                .map((value) => Number(value))
                .filter(Number.isInteger),
        );
        const retainedFiles = note.files.filter((file) => retainedIds.has(file.id!));

        if (retainedFiles.length + command.files.length > 5) {
            throw new BadRequestException('La nota permite un máximo de 5 archivos');
        }

        for (const file of note.files.filter((item) => !retainedIds.has(item.id!))) {
            await this.noteFileRepository.softDelete(file.id!, command.userId);
            await this.storage.deleteObject(file.storagePath, false);
        }

        await this.noteRepository.update(command.id, {
            title,
            content: command.dto.content.trim(),
            tasks,
            links,
            updatedBy: command.userId,
        });

        for (const file of command.files) {
            const safeName = `${Date.now()}-${file.originalname}`;
            const path = `repositories/${note.repositoryId}/notes/${command.id}/${safeName}`;
            await this.storage.uploadObject({
                path,
                body: file.buffer,
                isPublic: false,
                contentType: file.mimetype,
                multipart: true,
            });
            await this.noteFileRepository.create(
                new NoteFileEntity(null, command.id, file.originalname, path, command.userId),
            );
        }

        await this.repositoryRepository.markAsUpdated(note.repositoryId);
        const updated = await this.noteRepository.findById(command.id);

        return {
            message: NOTE_MESSAGES.UPDATED,
            data: NoteResponseMapper.toNoteResponse(updated!),
        };
    }

    private parseTasks(raw: string): NoteTask[] {
        try {
            const tasks = JSON.parse(raw) as unknown;
            if (!Array.isArray(tasks) || tasks.length > 100) throw new Error();

            return tasks.map((task) => {
                const value = task as Partial<NoteTask>;
                if (!value.id || typeof value.title !== 'string' || !value.title.trim()) throw new Error();
                const title = value.title.trim();
                if (title.length > 200) throw new Error();
                return {
                    id: String(value.id),
                    title,
                    completed: Boolean(value.completed),
                };
            });
        } catch {
            throw new BadRequestException('La lista de tareas no es válida');
        }
    }

    private parseLinks(raw: string): NoteLink[] {
        try {
            const links = JSON.parse(raw) as unknown;
            if (!Array.isArray(links) || links.length > 50) throw new Error();

            return links.map((link) => {
                const value = link as Partial<NoteLink>;
                if (!value.id || typeof value.url !== 'string') throw new Error();
                const url = value.url.trim();
                if (!url || url.length > 2048) throw new Error();
                const parsedUrl = new URL(url);
                if (!['http:', 'https:'].includes(parsedUrl.protocol)) throw new Error();

                return {
                    id: String(value.id),
                    url,
                };
            });
        } catch {
            throw new BadRequestException('La lista de enlaces no es válida');
        }
    }
}
