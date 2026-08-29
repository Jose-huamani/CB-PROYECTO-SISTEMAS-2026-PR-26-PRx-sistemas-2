import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RepositoryVisibility } from '@generated-prisma/client';

import { CreateFileCommand } from '@modules/files/application/commands/create-file/create-file.command';
import { FILE_MESSAGES } from '@modules/files/application/constants/file-messages.constants';
import { FOLDER_MESSAGES } from '@modules/files/application/constants/folder-messages.constants';
import { FileResponseMapper } from '@modules/files/application/mappers/file-response.mapper';
import { FileEntity } from '@modules/files/domain/entities/file.entity';
import { FileRepository } from '@modules/files/domain/repositories/file.repository';
import { FolderRepository } from '@modules/files/domain/repositories/folder.repository';
import { REPOSITORY_MESSAGES } from '@modules/repositories/application/constants/repository-messages.constants';
import { RepositoryUserRepository } from '@modules/repositories/domain/repositories/repository-user.repository';
import { RepositoryRepository } from '@modules/repositories/domain/repositories/repository.repository';
import { TAG_MESSAGES } from '@modules/tags/application/constants/tag-messages.constants';
import { TagEntity } from '@modules/tags/domain/entities/tag.entity';
import { TagRepository } from '@modules/tags/domain/repositories/tag.repository';
import { TigrisStorageService } from '@shared/infrastructure/storage/tigris-storage.service';
import { FileNameUtil } from '@shared/utils/file-name.util';

@CommandHandler(CreateFileCommand)
export class CreateFileHandler implements ICommandHandler<CreateFileCommand> {
  constructor(
    @Inject(FileRepository)
    private readonly fileRepository: FileRepository,
    @Inject(FolderRepository)
    private readonly folderRepository: FolderRepository,
    @Inject(RepositoryRepository)
    private readonly repositoryRepository: RepositoryRepository,
    @Inject(RepositoryUserRepository)
    private readonly repositoryUserRepository: RepositoryUserRepository,
    @Inject(TagRepository)
    private readonly tagRepository: TagRepository,
    private readonly tigrisStorageService: TigrisStorageService,
  ) {}

  async execute(command: CreateFileCommand) {
    const { dto, file, userId } = command;
    const { folderId, repositoryId, tags } = dto;

    if (file.size <= 0) {
      throw new BadRequestException(FILE_MESSAGES.FILE_EMPTY);
    }

    const repository = await this.repositoryRepository.findById(repositoryId);

    if (!repository) {
      throw new NotFoundException(REPOSITORY_MESSAGES.NOT_FOUND);
    }

    const isOwner = repository.ownerUserId === userId;

    if (repository.visibility === RepositoryVisibility.intimo && !isOwner) {
      throw new ForbiddenException(FILE_MESSAGES.CREATE_FORBIDDEN);
    }

    if (!isOwner) {
      const repositoryUser =
        await this.repositoryUserRepository.findByRepositoryIdAndUserId(
          repositoryId,
          userId,
        );

      if (!repositoryUser) {
        throw new ForbiddenException(FILE_MESSAGES.CREATE_FORBIDDEN);
      }
    }

    if (folderId) {
      const folder = await this.folderRepository.findByIdAndRepositoryId(
        folderId,
        repositoryId,
      );

      if (!folder) {
        throw new NotFoundException(FOLDER_MESSAGES.NOT_FOUND);
      }
    }

    const extension = FileNameUtil.getExtension(file.originalname);
    const name = FileNameUtil.removeMatchingExtension(dto.name, extension);
    const mimeType = file.mimetype || 'application/octet-stream';

    const fileExists = await this.fileRepository.existsByNameAndFolder(
      repositoryId,
      folderId ?? null,
      name,
      extension,
    );

    if (fileExists) {
      throw new ConflictException(FILE_MESSAGES.NAME_ALREADY_EXISTS);
    }

    const fileTags: TagEntity[] = [];

    if (tags) {
      for (const tagDto of tags) {
        const tag = await this.tagRepository.findOrCreateByName(tagDto.name);

        if (!tag) {
          throw new BadRequestException(
            TAG_MESSAGES.NOT_AVAILABLE(tagDto.name),
          );
        }

        fileTags.push(tag);
      }
    }

    const fileEntity = new FileEntity(
      null,
      repositoryId,
      folderId ?? null,
      name,
      extension,
      mimeType,
      file.size,
      '',
      fileTags,
      null,
      userId,
    );

    const createdFile = await this.fileRepository.create(fileEntity);
    const storageFileName = FileNameUtil.toSafeStorageName(name, extension);
    const storagePath = `repositories/${repositoryId}/files/${createdFile.id as number}/${storageFileName}`;

    await this.tigrisStorageService.uploadObject({
      path: storagePath,
      body: file.buffer,
      isPublic: false,
      contentType: mimeType,
    });

    const updatedFile = await this.fileRepository.updateStoragePath(
      createdFile.id as number,
      storagePath,
      userId,
    );

    await this.repositoryRepository.markAsUpdated(repositoryId);

    return {
      message: FILE_MESSAGES.CREATED,
      data: FileResponseMapper.toFileResponse(updatedFile),
    };
  }
}
