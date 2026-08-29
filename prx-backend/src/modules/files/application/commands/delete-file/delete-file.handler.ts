import { ForbiddenException, Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RepositoryVisibility } from '@generated-prisma/client';

import { DeleteFileCommand } from '@modules/files/application/commands/delete-file/delete-file.command';
import { FILE_MESSAGES } from '@modules/files/application/constants/file-messages.constants';
import { FileRepository } from '@modules/files/domain/repositories/file.repository';
import { REPOSITORY_MESSAGES } from '@modules/repositories/application/constants/repository-messages.constants';
import { RepositoryUserRepository } from '@modules/repositories/domain/repositories/repository-user.repository';
import { RepositoryRepository } from '@modules/repositories/domain/repositories/repository.repository';

const CO_OWNER_ROLE_NAME = 'copropietario';

@CommandHandler(DeleteFileCommand)
export class DeleteFileHandler implements ICommandHandler<DeleteFileCommand> {
  constructor(
    @Inject(FileRepository)
    private readonly fileRepository: FileRepository,
    @Inject(RepositoryRepository)
    private readonly repositoryRepository: RepositoryRepository,
    @Inject(RepositoryUserRepository)
    private readonly repositoryUserRepository: RepositoryUserRepository,
  ) {}

  async execute(command: DeleteFileCommand) {
    const { fileId, userId } = command;

    const file = await this.fileRepository.findById(fileId);

    if (!file) {
      throw new NotFoundException(FILE_MESSAGES.NOT_FOUND);
    }

    const repository = await this.repositoryRepository.findById(
      file.repositoryId,
    );

    if (!repository) {
      throw new NotFoundException(REPOSITORY_MESSAGES.NOT_FOUND);
    }

    const isOwner = repository.ownerUserId === userId;

    if (repository.visibility === RepositoryVisibility.intimo && !isOwner) {
      throw new ForbiddenException(FILE_MESSAGES.DELETE_FORBIDDEN);
    }

    const isFileCreator = file.createdBy === userId;

    if (!isOwner && !isFileCreator) {
      const repositoryUser =
        await this.repositoryUserRepository.findByRepositoryIdAndUserId(
          repository.id as number,
          userId,
        );

      const isCoOwner =
        repositoryUser?.repositoryRole?.name === CO_OWNER_ROLE_NAME;

      if (!isCoOwner) {
        throw new ForbiddenException(FILE_MESSAGES.DELETE_FORBIDDEN);
      }
    }

    await this.fileRepository.softDelete(file.id as number, userId);

    await this.repositoryRepository.markAsUpdated(file.repositoryId);

    return {
      message: FILE_MESSAGES.DELETED,
    };
  }
}
