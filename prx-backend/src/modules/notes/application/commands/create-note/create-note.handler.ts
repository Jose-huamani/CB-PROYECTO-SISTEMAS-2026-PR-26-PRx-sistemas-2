import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenException, Inject, NotFoundException } from '@nestjs/common';
import { RepositoryVisibility } from '@generated-prisma/enums';

import { CreateNoteCommand } from '@modules/notes/application/commands/create-note/create-note.command';
import { NoteRepository } from '@modules/notes/domain/repositories/note.repository';
import { NoteFileRepository } from '@modules/notes/domain/repositories/note-file.repository';
import { NoteEntity } from '@modules/notes/domain/entities/note.entity';
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

        const { title, content } = command.dto;

        const note = new NoteEntity(
            null,
            command.repositoryId,
            title,
            content,
            command.createdBy,
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
}
