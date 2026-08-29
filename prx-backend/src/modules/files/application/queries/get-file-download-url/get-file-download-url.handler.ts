import { ForbiddenException, Inject, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { RepositoryVisibility } from '@generated-prisma/client';

import { FILE_MESSAGES } from '@modules/files/application/constants/file-messages.constants';
import { FileDownloadResponseMapper } from '@modules/files/application/mappers/file-download-response.mapper';
import { GetFileDownloadUrlQuery } from '@modules/files/application/queries/get-file-download-url/get-file-download-url.query';
import { FileRepository } from '@modules/files/domain/repositories/file.repository';
import { REPOSITORY_MESSAGES } from '@modules/repositories/application/constants/repository-messages.constants';
import { RepositoryUserRepository } from '@modules/repositories/domain/repositories/repository-user.repository';
import { RepositoryRepository } from '@modules/repositories/domain/repositories/repository.repository';
import { TigrisStorageService } from '@shared/infrastructure/storage/tigris-storage.service';

@QueryHandler(GetFileDownloadUrlQuery)
export class GetFileDownloadUrlHandler implements IQueryHandler<GetFileDownloadUrlQuery> {
  constructor(
    @Inject(FileRepository)
    private readonly fileRepository: FileRepository,
    @Inject(RepositoryRepository)
    private readonly repositoryRepository: RepositoryRepository,
    @Inject(RepositoryUserRepository)
    private readonly repositoryUserRepository: RepositoryUserRepository,
    private readonly tigrisStorageService: TigrisStorageService,
  ) {}

  async execute(query: GetFileDownloadUrlQuery) {
    const { fileId, userId } = query;

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
      throw new ForbiddenException(FILE_MESSAGES.DOWNLOAD_FORBIDDEN);
    }

    if (repository.visibility === RepositoryVisibility.privado && !isOwner) {
      const repositoryUser =
        await this.repositoryUserRepository.findByRepositoryIdAndUserId(
          repository.id as number,
          userId,
        );

      if (!repositoryUser) {
        throw new ForbiddenException(FILE_MESSAGES.DOWNLOAD_FORBIDDEN);
      }
    }

    const url = await this.tigrisStorageService.getReadUrl(
      file.storagePath,
      false,
    );

    return {
      data: FileDownloadResponseMapper.toFileDownloadResponse(file, url),
    };
  }
}
