import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { RepositoryVisibility } from '@generated-prisma/enums';

import { GetNoteByIdQuery } from '@modules/notes/application/queries/get-note-by-id/get-note-by-id.query';
import { NoteRepository } from '@modules/notes/domain/repositories/note.repository';
import { RepositoryRepository } from '@modules/repositories/domain/repositories/repository.repository';
import { RepositoryUserRepository } from '@modules/repositories/domain/repositories/repository-user.repository';
import { NOTE_MESSAGES } from '@modules/notes/application/constants/note-messages.constants';
import { REPOSITORY_MESSAGES } from '@modules/repositories/application/constants/repository-messages.constants';
import { NoteResponseMapper } from '@modules/notes/application/mappers/note-response.mapper';

@QueryHandler(GetNoteByIdQuery)
export class GetNoteByIdHandler implements IQueryHandler<GetNoteByIdQuery> {
    constructor(
        @Inject(NoteRepository)
        private readonly noteRepository: NoteRepository,
        @Inject(RepositoryRepository)
        private readonly repositoryRepository: RepositoryRepository,
        @Inject(RepositoryUserRepository)
        private readonly repositoryUserRepository: RepositoryUserRepository,
    ) { }

    async execute(query: GetNoteByIdQuery) {
        const note = await this.noteRepository.findById(query.id);

        if (!note) {
            throw new NotFoundException(NOTE_MESSAGES.NOT_FOUND);
        }

        const repository = await this.repositoryRepository.findById(
            note.repositoryId,
        );

        if (!repository) {
            throw new NotFoundException(REPOSITORY_MESSAGES.NOT_FOUND);
        }

        const isPublic = repository.visibility === RepositoryVisibility.publico;
        const isPrivate = repository.visibility === RepositoryVisibility.privado;
        const isIntimate = repository.visibility === RepositoryVisibility.intimo;
        const isOwner = repository.ownerUserId === query.userId;

        let canRead = false;

        if (isPublic) {
            canRead = true;
        }

        if (isPrivate) {
            const repoUser = await this.repositoryUserRepository.findByRepositoryIdAndUserId(
                repository.id!,
                query.userId,
            );
            canRead = !!repoUser;
        }

        if (isIntimate) {
            canRead = isOwner;
        }

        if (!canRead) {
            throw new ForbiddenException(NOTE_MESSAGES.FORBIDDEN);
        }

        return {
            data: NoteResponseMapper.toNoteResponse(note),
        };
    }
}
