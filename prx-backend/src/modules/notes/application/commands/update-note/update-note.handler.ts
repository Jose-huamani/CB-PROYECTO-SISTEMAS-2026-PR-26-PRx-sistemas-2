import { BadRequestException, ForbiddenException, Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RepositoryVisibility } from '@generated-prisma/enums';

import { UpdateNoteCommand } from './update-note.command';
import { NoteRepository } from '@modules/notes/domain/repositories/note.repository';
import { NoteLink, NoteTask } from '@modules/notes/domain/entities/note.entity';
import { NoteResponseMapper } from '@modules/notes/application/mappers/note-response.mapper';
import { NOTE_MESSAGES } from '@modules/notes/application/constants/note-messages.constants';
import { RepositoryRepository } from '@modules/repositories/domain/repositories/repository.repository';
import { RepositoryUserRepository } from '@modules/repositories/domain/repositories/repository-user.repository';
import { REPOSITORY_MESSAGES } from '@modules/repositories/application/constants/repository-messages.constants';
import { NoteMediaStorageService } from '@modules/notes/application/services/note-media-storage.service';

@CommandHandler(UpdateNoteCommand)
export class UpdateNoteHandler implements ICommandHandler<UpdateNoteCommand> {
    constructor(
        @Inject(NoteRepository) private readonly noteRepository: NoteRepository,
        @Inject(RepositoryRepository) private readonly repositoryRepository: RepositoryRepository,
        @Inject(RepositoryUserRepository) private readonly repositoryUserRepository: RepositoryUserRepository,
        private readonly mediaStorage: NoteMediaStorageService,
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
        const retainedIds = command.dto.retainedFileIds === undefined
            ? note.files.map((file) => file.id!)
            : command.dto.retainedFileIds.trim() === '' ? [] : command.dto.retainedFileIds.split(',').map(Number);
        if (retainedIds.some((id) => !Number.isInteger(id) || !note.files.some((file) => file.id === id))) {
            throw new BadRequestException('Los archivos que se conservan no pertenecen a esta nota');
        }
        const retained = new Set(retainedIds);
        if (retained.size + command.files.length > 5) {
            throw new BadRequestException('La nota permite un máximo de 5 archivos');
        }
        const removed = note.files.filter((file) => !retained.has(file.id!));
        const uploaded = await this.mediaStorage.upload(command.files, note.repositoryId, command.userId);
        let updated;
        try {
            updated = await this.noteRepository.updateWithFiles(command.id, {
                title,
                content: command.dto.content.trim(),
                tasks,
                links,
                updatedBy: command.userId,
            }, [...retained], uploaded);
        } catch (error) {
            await this.mediaStorage.remove(uploaded.map((file) => file.storagePath));
            throw error;
        }
        await this.mediaStorage.remove(removed.map((file) => file.storagePath));
        return {
            message: NOTE_MESSAGES.UPDATED,
            data: NoteResponseMapper.toNoteResponse(updated),
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
