import { ForbiddenException, Inject, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { RepositoryVisibility } from '@generated-prisma/client';

import { FOLDER_MESSAGES } from '@modules/files/application/constants/folder-messages.constants';
import { ExplorerResponseMapper } from '@modules/files/application/mappers/explorer-response.mapper';
import { GetExplorerContentQuery } from '@modules/files/application/queries/get-explorer-content/get-explorer-content.query';
import { FileEntity } from '@modules/files/domain/entities/file.entity';
import { FolderEntity } from '@modules/files/domain/entities/folder.entity';
import { FileRepository } from '@modules/files/domain/repositories/file.repository';
import { FolderRepository } from '@modules/files/domain/repositories/folder.repository';
import { REPOSITORY_MESSAGES } from '@modules/repositories/application/constants/repository-messages.constants';
import { RepositoryUserRepository } from '@modules/repositories/domain/repositories/repository-user.repository';
import { RepositoryRepository } from '@modules/repositories/domain/repositories/repository.repository';

@QueryHandler(GetExplorerContentQuery)
export class GetExplorerContentHandler implements IQueryHandler<GetExplorerContentQuery> {
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

  async execute(query: GetExplorerContentQuery) {
    const { dto, repositoryId, userId } = query;

    const repository = await this.repositoryRepository.findById(repositoryId);

    if (!repository) {
      throw new NotFoundException(REPOSITORY_MESSAGES.NOT_FOUND);
    }

    const isOwner = repository.ownerUserId === userId;

    if (repository.visibility === RepositoryVisibility.intimo && !isOwner) {
      throw new ForbiddenException(FOLDER_MESSAGES.EXPLORER_FORBIDDEN);
    }

    if (repository.visibility === RepositoryVisibility.privado && !isOwner) {
      const repositoryUser =
        await this.repositoryUserRepository.findByRepositoryIdAndUserId(
          repositoryId,
          userId,
        );

      if (!repositoryUser) {
        throw new ForbiddenException(FOLDER_MESSAGES.EXPLORER_FORBIDDEN);
      }
    }

    let breadcrumbs: FolderEntity[] = [];
    let parentId: number | null = null;
    let parentPath: string | null = null;

    if (dto.folderId) {
      const currentFolder = await this.folderRepository.findByIdAndRepositoryId(
        dto.folderId,
        repositoryId,
      );

      if (!currentFolder) {
        throw new NotFoundException(FOLDER_MESSAGES.NOT_FOUND);
      }

      breadcrumbs = await this.folderRepository.findAncestorsByPath(
        repositoryId,
        currentFolder.path,
      );

      parentId = currentFolder.id as number;
      parentPath = currentFolder.path;
    }

    let folders: FolderEntity[] = [];
    let files: FileEntity[] = [];

    const search = dto.search;

    if (search) {
      const tagSearch = search.toLowerCase().replace(/\s+/g, '-');

      folders = await this.folderRepository.searchInTree(
        repositoryId,
        parentPath,
        search,
      );

      files = await this.fileRepository.searchInTree(
        repositoryId,
        parentId,
        parentPath,
        search,
        tagSearch,
      );
    } else {
      folders = await this.folderRepository.findChildren(
        repositoryId,
        parentId,
      );

      files = await this.fileRepository.findChildren(repositoryId, parentId);
    }

    return {
      data: ExplorerResponseMapper.toExplorerResponse({
        repositoryName: repository.name,
        breadcrumbs,
        folders,
        files,
      }),
    };
  }
}
