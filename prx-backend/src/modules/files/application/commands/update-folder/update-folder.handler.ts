import {
  ConflictException,
  ForbiddenException,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RepositoryVisibility } from '@generated-prisma/client';

import { UpdateFolderCommand } from '@modules/files/application/commands/update-folder/update-folder.command';
import { FOLDER_MESSAGES } from '@modules/files/application/constants/folder-messages.constants';
import { FolderResponseMapper } from '@modules/files/application/mappers/folder-response.mapper';
import { FolderRepository } from '@modules/files/domain/repositories/folder.repository';
import { REPOSITORY_MESSAGES } from '@modules/repositories/application/constants/repository-messages.constants';
import { RepositoryUserRepository } from '@modules/repositories/domain/repositories/repository-user.repository';
import { RepositoryRepository } from '@modules/repositories/domain/repositories/repository.repository';

const CO_OWNER_ROLE_NAME = 'copropietario';

@CommandHandler(UpdateFolderCommand)
export class UpdateFolderHandler implements ICommandHandler<UpdateFolderCommand> {
  constructor(
    @Inject(FolderRepository)
    private readonly folderRepository: FolderRepository,
    @Inject(RepositoryRepository)
    private readonly repositoryRepository: RepositoryRepository,
    @Inject(RepositoryUserRepository)
    private readonly repositoryUserRepository: RepositoryUserRepository,
  ) {}

  async execute(command: UpdateFolderCommand) {
    const { dto, folderId, userId } = command;
    const { color, name } = dto;

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
      throw new ForbiddenException(FOLDER_MESSAGES.UPDATE_FORBIDDEN);
    }

    const isFolderCreator = folder.createdBy === userId;

    if (!isOwner && !isFolderCreator) {
      const repositoryUser =
        await this.repositoryUserRepository.findByRepositoryIdAndUserId(
          repository.id as number,
          userId,
        );

      const isCoOwner =
        repositoryUser?.repositoryRole?.name === CO_OWNER_ROLE_NAME;

      if (!isCoOwner) {
        throw new ForbiddenException(FOLDER_MESSAGES.UPDATE_FORBIDDEN);
      }
    }

    const folderName = name ?? folder.name;
    const folderColor = color ?? folder.color;

    if (folderName !== folder.name) {
      const folderExists = await this.folderRepository.existsByNameAndParent(
        folder.repositoryId,
        folder.parentId,
        folderName,
        folder.id as number,
      );

      if (folderExists) {
        throw new ConflictException(FOLDER_MESSAGES.NAME_ALREADY_EXISTS);
      }
    }

    const updatedFolder = await this.folderRepository.update(
      folder.id as number,
      folderName,
      folderColor,
      userId,
    );

    await this.repositoryRepository.markAsUpdated(repository.id as number);

    return {
      message: FOLDER_MESSAGES.UPDATED,
      data: FolderResponseMapper.toFolderResponse(updatedFolder),
    };
  }
}
