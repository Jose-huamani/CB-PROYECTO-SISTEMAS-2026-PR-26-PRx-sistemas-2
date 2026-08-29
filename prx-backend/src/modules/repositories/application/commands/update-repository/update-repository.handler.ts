import {
  BadRequestException,
  ConflictException,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UpdateRepositoryCommand } from '@modules/repositories/application/commands/update-repository/update-repository.command';
import { REPOSITORY_CATEGORY_MESSAGES } from '@modules/repositories/application/constants/repository-category-messages.constants';
import { REPOSITORY_MESSAGES } from '@modules/repositories/application/constants/repository-messages.constants';
import { RepositoryResponseMapper } from '@modules/repositories/application/mappers/repository-response.mapper';
import { RepositoryEntity } from '@modules/repositories/domain/entities/repository.entity';
import { RepositoryCategoryRepository } from '@modules/repositories/domain/repositories/repository-category.repository';
import { RepositoryRepository } from '@modules/repositories/domain/repositories/repository.repository';
import { RepositoryUserRepository } from '@modules/repositories/domain/repositories/repository-user.repository';
import { TAG_MESSAGES } from '@modules/tags/application/constants/tag-messages.constants';
import { TagEntity } from '@modules/tags/domain/entities/tag.entity';
import { TagRepository } from '@modules/tags/domain/repositories/tag.repository';

@CommandHandler(UpdateRepositoryCommand)
export class UpdateRepositoryHandler implements ICommandHandler<UpdateRepositoryCommand> {
  constructor(
    @Inject(RepositoryRepository)
    private readonly repositoryRepository: RepositoryRepository,
    @Inject(RepositoryCategoryRepository)
    private readonly repositoryCategoryRepository: RepositoryCategoryRepository,
    @Inject(RepositoryUserRepository)
    private readonly repositoryUserRepository: RepositoryUserRepository,
    @Inject(TagRepository)
    private readonly tagRepository: TagRepository,
  ) {}

  async execute(command: UpdateRepositoryCommand) {
    const { category, color, description, name, tags, visibility } =
      command.dto;
    const { id, userId } = command;

    const currentRepository = await this.repositoryRepository.findById(id);

    if (!currentRepository) {
      throw new NotFoundException(REPOSITORY_MESSAGES.NOT_FOUND);
    }

    if (name) {
      const repositoryExists =
        await this.repositoryRepository.existsByNameAndOwnerUserId(
          name,
          currentRepository.ownerUserId,
          id,
        );

      if (repositoryExists) {
        throw new ConflictException(REPOSITORY_MESSAGES.NAME_ALREADY_EXISTS);
      }
    }

    let repositoryCategoryId = currentRepository.repositoryCategoryId;

    if (category) {
      const repositoryCategory =
        await this.repositoryCategoryRepository.findOrCreateByName(
          category.name,
          userId,
        );

      if (!repositoryCategory) {
        throw new BadRequestException(
          REPOSITORY_CATEGORY_MESSAGES.NOT_AVAILABLE,
        );
      }

      repositoryCategoryId = repositoryCategory.id as number;
    }

    const shouldSyncTags = tags !== undefined;
    const repositoryTags: TagEntity[] = [];

    if (shouldSyncTags) {
      for (const tagDto of tags) {
        const tag = await this.tagRepository.findOrCreateByName(tagDto.name);

        if (!tag) {
          throw new BadRequestException(
            TAG_MESSAGES.NOT_AVAILABLE(tagDto.name),
          );
        }

        repositoryTags.push(tag);
      }
    }

    const repository = await this.repositoryRepository.update(
      id,
      {
        repositoryCategoryId,
        name,
        visibility,
        color,
        description,
        tags: repositoryTags,
        updatedBy: userId,
      } as Partial<RepositoryEntity>,
      shouldSyncTags,
    );

    const currentUserRepository =
      await this.repositoryUserRepository.findByRepositoryIdAndUserId(
        id,
        userId,
      );

    return {
      message: REPOSITORY_MESSAGES.UPDATED,
      data: RepositoryResponseMapper.toRepositoryResponse(
        repository,
        currentUserRepository?.repositoryRole,
        currentUserRepository?.repositoryFunction,
      ),
    };
  }
}
