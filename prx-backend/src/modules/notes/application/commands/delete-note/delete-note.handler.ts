import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenException, Inject, NotFoundException } from '@nestjs/common';

import { DeleteNoteCommand } from '@modules/notes/application/commands/delete-note/delete-note.command';
import { NoteRepository } from '@modules/notes/domain/repositories/note.repository';
import { RepositoryRepository } from '@modules/repositories/domain/repositories/repository.repository';
import { RepositoryUserRepository } from '@modules/repositories/domain/repositories/repository-user.repository';
import { NOTE_MESSAGES } from '@modules/notes/application/constants/note-messages.constants';
import { REPOSITORY_MESSAGES } from '@modules/repositories/application/constants/repository-messages.constants';
import { RepositoryVisibility } from '@generated-prisma/enums';

const CO_OWNER_ROLE_NAME = 'copropietario';

@CommandHandler(DeleteNoteCommand)
export class DeleteNoteHandler implements ICommandHandler<DeleteNoteCommand> {
    constructor(
        @Inject(NoteRepository)
        private readonly noteRepository: NoteRepository,
        @Inject(RepositoryRepository)
        private readonly repositoryRepository: RepositoryRepository,
        @Inject(RepositoryUserRepository)
        private readonly repositoryUserRepository: RepositoryUserRepository,
    ) { }

    async execute(command: DeleteNoteCommand) {
        const note = await this.noteRepository.findById(command.id);

        if (!note) {
            throw new NotFoundException(NOTE_MESSAGES.NOT_FOUND);
        }

        const repository = await this.repositoryRepository.findById(
            note.repositoryId,
        );

        if (!repository) {
            throw new NotFoundException(REPOSITORY_MESSAGES.NOT_FOUND);
        }

        const isOwner = repository.ownerUserId === command.userId;
        const isIntimate = repository.visibility === RepositoryVisibility.intimo;

        if (isIntimate && !isOwner) {
            throw new ForbiddenException(NOTE_MESSAGES.FORBIDDEN);
        }

        const isCreator = note.createdBy === command.userId;

        if (!isOwner && !isCreator) {
            const repositoryUser = await this.repositoryUserRepository.findByRepositoryIdAndUserId(
                repository.id!,
                command.userId,
            );

            const isCoOwner = repositoryUser?.repositoryRole?.name === CO_OWNER_ROLE_NAME;

            if (!isCoOwner) {
                throw new ForbiddenException(NOTE_MESSAGES.FORBIDDEN);
            }
        }

        await this.noteRepository.softDelete(command.id, command.userId);
        await this.repositoryRepository.markAsUpdated(note.repositoryId);

        return {
            message: NOTE_MESSAGES.DELETED,
        };
    }
}
