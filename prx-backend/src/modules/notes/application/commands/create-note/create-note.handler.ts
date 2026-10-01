import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException, ForbiddenException, Inject, NotFoundException } from '@nestjs/common';
import { RepositoryVisibility } from '@generated-prisma/enums';

import { CreateNoteCommand } from '@modules/notes/application/commands/create-note/create-note.command';
import { NoteRepository } from '@modules/notes/domain/repositories/note.repository';
import { NoteFileRepository } from '@modules/notes/domain/repositories/note-file.repository';
import { NoteEntity, NoteLink } from '@modules/notes/domain/entities/note.entity';
import { NoteFileEntity } from '@modules/notes/domain/entities/note-file.entity';
import { NoteResponseMapper } from '@modules/notes/application/mappers/note-response.mapper';
import { NOTE_MESSAGES } from '@modules/notes/application/constants/note-messages.constants';
import { RepositoryRepository } from '@modules/repositories/domain/repositories/repository.repository';
import { RepositoryUserRepository } from '@modules/repositories/domain/repositories/repository-user.repository';
import { REPOSITORY_MESSAGES } from '@modules/repositories/application/constants/repository-messages.constants';
import { TigrisStorageService } from '@shared/infrastructure/storage/tigris-storage.service';

@CommandHandler(CreateNoteCommand)
export class CreateNoteHandler implements ICommandHandler<CreateNoteCommand> {
    constructor(
        @Inject(NoteRepository)
        private readonly noteRepository: NoteRepository,
        @Inject(NoteFileRepository)
        private readonly noteFileRepository: NoteFileRepository,
        @Inject(RepositoryRepository)
        private readonly repositoryRepository: RepositoryRepository,
        @Inject(RepositoryUserRepository)
        private readonly repositoryUserRepository: RepositoryUserRepository,
        private readonly tigrisStorageService: TigrisStorageService,
    ) { }

    async execute(command: CreateNoteCommand) {
        const repository = await this.repositoryRepository.findById(
            command.repositoryId,
        );

        if (!repository) {
            throw new NotFoundException(REPOSITORY_MESSAGES.NOT_FOUND);
        }

        // For intimate repositories, only owner can create notes
        const isIntimate = repository.visibility === RepositoryVisibility.intimo;

        if (isIntimate) {
            if (repository.ownerUserId !== command.createdBy) {
                throw new ForbiddenException(NOTE_MESSAGES.FORBIDDEN);
            }
        } else {
            // For non-intimate repos, user must be registered in repositoryUsers
            const repoUser = await this.repositoryUserRepository.findByRepositoryIdAndUserId(
                command.repositoryId,
                command.createdBy,
            );

            if (!repoUser) {
                throw new ForbiddenException(NOTE_MESSAGES.FORBIDDEN);
            }
        }

        const title = command.dto.title.trim();
        const content = command.dto.content.trim();
        const duplicate = await this.noteRepository.findActiveByRepositoryIdAndTitle(
            command.repositoryId,
            title,
        );

        if (duplicate) {
            throw new BadRequestException(NOTE_MESSAGES.DUPLICATE_TITLE);
        }

        const links = this.parseLinks(command.dto.links);

        const note = new NoteEntity(
            null,
            command.repositoryId,
            title,
            content,
            command.createdBy,
            [],
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            [],
            links,
        );

        const created = await this.noteRepository.create(note);

        if (command.files && command.files.length > 0) {
            for (const file of command.files) {
                const path = `repositories/${command.repositoryId}/notes/${created.id}/${file.originalname}`;

                await this.tigrisStorageService.uploadObject({
                    path,
                    body: file.buffer,
                    isPublic: false,
                    contentType: file.mimetype,
                    multipart: true,
                });

                const noteFile = new NoteFileEntity(
                    null,
                    created.id!,
                    file.originalname,
                    path,
                    command.createdBy,
                );

                await this.noteFileRepository.create(noteFile);
            }
        }

        await this.repositoryRepository.markAsUpdated(repository.id!);

        return {
            message: NOTE_MESSAGES.CREATED,
            data: NoteResponseMapper.toNoteResponse(created),
        };
    }

    private parseLinks(raw?: string): NoteLink[] {
        if (!raw) {
            return [];
        }

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
