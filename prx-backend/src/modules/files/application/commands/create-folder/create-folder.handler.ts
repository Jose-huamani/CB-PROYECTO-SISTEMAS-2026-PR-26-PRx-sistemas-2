import {
  ConflictException,
  ForbiddenException,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RepositoryVisibility } from '@generated-prisma/client';

import { CreateFolderCommand } from '@modules/files/application/commands/create-folder/create-folder.command';
import { FOLDER_MESSAGES } from '@modules/files/application/constants/folder-messages.constants';
import { FolderResponseMapper } from '@modules/files/application/mappers/folder-response.mapper';
import { FolderEntity } from '@modules/files/domain/entities/folder.entity';
import { FolderRepository } from '@modules/files/domain/repositories/folder.repository';
import { REPOSITORY_MESSAGES } from '@modules/repositories/application/constants/repository-messages.constants';
import { RepositoryUserRepository } from '@modules/repositories/domain/repositories/repository-user.repository';
import { RepositoryRepository } from '@modules/repositories/domain/repositories/repository.repository';

@CommandHandler(CreateFolderCommand)
export class CreateFolderHandler implements ICommandHandler<CreateFolderCommand> {
  constructor(
    @Inject(FolderRepository)
    private readonly folderRepository: FolderRepository,
    @Inject(RepositoryRepository)
    private readonly repositoryRepository: RepositoryRepository,
    @Inject(RepositoryUserRepository)
    private readonly repositoryUserRepository: RepositoryUserRepository,
  ) {}

  async execute(command: CreateFolderCommand) {
    const { color, name, parentId, repositoryId } = command.dto;
    const { userId } = command;

    const repository = await this.repositoryRepository.findById(repositoryId);

    if (!repository) {
      throw new NotFoundException(REPOSITORY_MESSAGES.NOT_FOUND);
    }

    const isOwner = repository.ownerUserId === userId;

    if (repository.visibility === RepositoryVisibility.intimo && !isOwner) {
      throw new ForbiddenException(FOLDER_MESSAGES.CREATE_FORBIDDEN);
    }

    if (!isOwner) {
      const repositoryUser =
        await this.repositoryUserRepository.findByRepositoryIdAndUserId(
          repositoryId,
          userId,
        );

      if (!repositoryUser) {
        throw new ForbiddenException(FOLDER_MESSAGES.CREATE_FORBIDDEN);
      }
    }

    let folderLevel = 1;
    let parentPath = '';

    if (parentId) {
      const parentFolder = await this.folderRepository.findByIdAndRepositoryId(
        parentId,
        repositoryId,
      );

      if (!parentFolder) {
        throw new NotFoundException(FOLDER_MESSAGES.PARENT_NOT_FOUND);
      }

      folderLevel = parentFolder.level + 1;
      parentPath = parentFolder.path;
    }

    const folderExists = await this.folderRepository.existsByNameAndParent(
      repositoryId,
      parentId ?? null,
      name,
    );

    if (folderExists) {
      throw new ConflictException(FOLDER_MESSAGES.NAME_ALREADY_EXISTS);
    }

    const folderEntity = new FolderEntity(
      null,
      repositoryId,
      parentId ?? null,
      name,
      '',
      folderLevel,
      color,
      null,
      userId,
    );

    const createdFolder = await this.folderRepository.create(folderEntity);

    const folderPath = parentPath
      ? `${parentPath}/${createdFolder.id as number}`
      : `${createdFolder.id as number}`;

    const folder = await this.folderRepository.updatePath(
      createdFolder.id as number,
      folderPath,
      userId,
    );

    await this.repositoryRepository.markAsUpdated(repositoryId);

    return {
      message: FOLDER_MESSAGES.CREATED,
      data: FolderResponseMapper.toFolderResponse(folder),
    };
  }
}
