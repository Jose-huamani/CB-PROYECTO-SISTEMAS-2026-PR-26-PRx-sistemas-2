import { ForbiddenException, Inject, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { RepositoryVisibility } from '@generated-prisma/client';

import { NOTE_FILE_MESSAGES } from '@modules/notes/application/constants/note-file-messages.constants';
import { GetNoteFileDownloadUrlQuery } from '@modules/notes/application/queries/get-note-file-download-url/get-note-file-download-url.query';
import { NoteFileRepository } from '@modules/notes/domain/repositories/note-file.repository';
import { NoteRepository } from '@modules/notes/domain/repositories/note.repository';
import { REPOSITORY_MESSAGES } from '@modules/repositories/application/constants/repository-messages.constants';
import { RepositoryUserRepository } from '@modules/repositories/domain/repositories/repository-user.repository';
import { RepositoryRepository } from '@modules/repositories/domain/repositories/repository.repository';
import { TigrisStorageService } from '@shared/infrastructure/storage/tigris-storage.service';

@QueryHandler(GetNoteFileDownloadUrlQuery)
export class GetNoteFileDownloadUrlHandler
    implements IQueryHandler<GetNoteFileDownloadUrlQuery> {
    constructor(
        @Inject(NoteFileRepository)
        private readonly noteFileRepository: NoteFileRepository,
        @Inject(NoteRepository)
        private readonly noteRepository: NoteRepository,
        @Inject(RepositoryRepository)
        private readonly repositoryRepository: RepositoryRepository,
        @Inject(RepositoryUserRepository)
        private readonly repositoryUserRepository: RepositoryUserRepository,
        private readonly tigrisStorageService: TigrisStorageService,
    ) { }

    async execute(query: GetNoteFileDownloadUrlQuery) {
        const { fileId, userId } = query;

        const noteFile = await this.noteFileRepository.findById(fileId);

        if (!noteFile) {
            throw new NotFoundException(NOTE_FILE_MESSAGES.NOT_FOUND);
        }

        const note = await this.noteRepository.findById(noteFile.noteId);

        if (!note) {
            throw new NotFoundException(NOTE_FILE_MESSAGES.NOTE_NOT_FOUND);
        }

        const repository = await this.repositoryRepository.findById(
            note.repositoryId,
        );

        if (!repository) {
            throw new NotFoundException(REPOSITORY_MESSAGES.NOT_FOUND);
        }

        const isOwner = repository.ownerUserId === userId;

        if (repository.visibility === RepositoryVisibility.intimo && !isOwner) {
            throw new ForbiddenException(NOTE_FILE_MESSAGES.DOWNLOAD_FORBIDDEN);
        }

        if (repository.visibility === RepositoryVisibility.privado && !isOwner) {
            const repositoryUser =
                await this.repositoryUserRepository.findByRepositoryIdAndUserId(
                    repository.id as number,
                    userId,
                );

            if (!repositoryUser) {
                throw new ForbiddenException(NOTE_FILE_MESSAGES.DOWNLOAD_FORBIDDEN);
            }
        }

        const url = await this.tigrisStorageService.getReadUrl(
            noteFile.storagePath,
            false,
        );

        return {
            data: {
                url,
                fileName: noteFile.name,
            },
        };
    }
}
