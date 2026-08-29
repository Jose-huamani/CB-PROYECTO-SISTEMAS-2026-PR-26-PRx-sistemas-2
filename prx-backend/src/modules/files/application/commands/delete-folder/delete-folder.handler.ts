import { ForbiddenException, Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RepositoryVisibility } from '@generated-prisma/client';

import { DeleteFolderCommand } from '@modules/files/application/commands/delete-folder/delete-folder.command';
import { FOLDER_MESSAGES } from '@modules/files/application/constants/folder-messages.constants';
import { FileRepository } from '@modules/files/domain/repositories/file.repository';
import { FolderRepository } from '@modules/files/domain/repositories/folder.repository';
import { REPOSITORY_MESSAGES } from '@modules/repositories/application/constants/repository-messages.constants';
import { RepositoryUserRepository } from '@modules/repositories/domain/repositories/repository-user.repository';
import { RepositoryRepository } from '@modules/repositories/domain/repositories/repository.repository';

const CO_OWNER_ROLE_NAME = 'copropietario';

@CommandHandler(DeleteFolderCommand)
export class DeleteFolderHandler implements ICommandHandler<DeleteFolderCommand> {
  constructor(
    @Inject(FolderRepository)
    private readonly folderRepository: FolderRepository,
    @Inject(FileRepository)
    private readonly fileRepository: FileRepository,
    @Inject(RepositoryRepository)
    private readonly repositoryRepository: RepositoryRepository,
    @Inject(RepositoryUserRepository)
    private readonly repositoryUserRepository: RepositoryUserRepository,
  ) {}

  async execute(command: DeleteFolderCommand) {
    const { folderId, userId } = command;

    const folder = await this.folderRepository.findById(folderId);

    if (!folder) {
      throw new NotFoundException(FOLDER_MESSAGES.NOT_FOUND);
    }

    const repository = await this.repositoryRepository.findById(
      folder.repositoryId,
    );

    if (!repository) {
      throw new NotFoundException(REPOSITORY_MESSAGES.NOT_FOUND);
    }

    const isOwner = repository.ownerUserId === userId;

    if (repository.visibility === RepositoryVisibility.intimo && !isOwner) {
      throw new ForbiddenException(FOLDER_MESSAGES.DELETE_FORBIDDEN);
    }

    const isFolderCreator = folder.createdBy === userId;

    let isCoOwner = false;

    if (!isOwner) {
      const repositoryUser =
        await this.repositoryUserRepository.findByRepositoryIdAndUserId(
          repository.id as number,
          userId,
        );

      isCoOwner = repositoryUser?.repositoryRole?.name === CO_OWNER_ROLE_NAME;
    }

    if (isOwner || isCoOwner) {
      await this.folderRepository.softDeleteTreeByPath(
        folder.repositoryId,
        folder.path,
        userId,
      );

      await this.repositoryRepository.markAsUpdated(folder.repositoryId);

      return {
        message: FOLDER_MESSAGES.DELETED,
      };
    }

    if (!isFolderCreator) {
      throw new ForbiddenException(FOLDER_MESSAGES.DELETE_FORBIDDEN);
    }

    const folderHasChildren = await this.folderRepository.existsByParentId(
      folder.repositoryId,
      folder.id as number,
    );

    const folderHasFiles = await this.fileRepository.existsByFolderId(
      folder.repositoryId,
      folder.id as number,
    );

    if (folderHasChildren || folderHasFiles) {
      throw new ForbiddenException(FOLDER_MESSAGES.NOT_EMPTY);
    }

    await this.folderRepository.softDelete(folder.id as number, userId);

    await this.repositoryRepository.markAsUpdated(folder.repositoryId);

    return {
      message: FOLDER_MESSAGES.DELETED,
    };
  }
}
