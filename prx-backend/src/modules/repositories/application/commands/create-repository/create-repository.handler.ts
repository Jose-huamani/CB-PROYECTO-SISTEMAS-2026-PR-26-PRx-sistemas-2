import {
  BadRequestException,
  ConflictException,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CreateRepositoryCommand } from '@modules/repositories/application/commands/create-repository/create-repository.command';
import { REPOSITORY_CATEGORY_MESSAGES } from '@modules/repositories/application/constants/repository-category-messages.constants';
import { REPOSITORY_FUNCTION_MESSAGES } from '@modules/repositories/application/constants/repository-function-messages.constants';
import { REPOSITORY_MESSAGES } from '@modules/repositories/application/constants/repository-messages.constants';
import { REPOSITORY_ROLE_MESSAGES } from '@modules/repositories/application/constants/repository-role-messages.constants';
import { RepositoryResponseMapper } from '@modules/repositories/application/mappers/repository-response.mapper';
import { RepositoryEntity } from '@modules/repositories/domain/entities/repository.entity';
import { RepositoryCategoryRepository } from '@modules/repositories/domain/repositories/repository-category.repository';
import { RepositoryFunctionRepository } from '@modules/repositories/domain/repositories/repository-function.repository';
import { RepositoryRoleRepository } from '@modules/repositories/domain/repositories/repository-role.repository';
import { RepositoryRepository } from '@modules/repositories/domain/repositories/repository.repository';
import { TAG_MESSAGES } from '@modules/tags/application/constants/tag-messages.constants';
import { TagEntity } from '@modules/tags/domain/entities/tag.entity';
import { TagRepository } from '@modules/tags/domain/repositories/tag.repository';
import { UserRepository } from '@modules/users/domain/repositories/user.repository';

const OWNER_ROLE_NAME = 'propietario';
const OWNER_FUNCTION_NAME = 'experto';

@CommandHandler(CreateRepositoryCommand)
export class CreateRepositoryHandler implements ICommandHandler<CreateRepositoryCommand> {
  constructor(
    @Inject(RepositoryRepository)
    private readonly repositoryRepository: RepositoryRepository,
    @Inject(RepositoryCategoryRepository)
    private readonly repositoryCategoryRepository: RepositoryCategoryRepository,
    @Inject(RepositoryRoleRepository)
    private readonly repositoryRoleRepository: RepositoryRoleRepository,
    @Inject(RepositoryFunctionRepository)
    private readonly repositoryFunctionRepository: RepositoryFunctionRepository,
    @Inject(TagRepository)
    private readonly tagRepository: TagRepository,
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(command: CreateRepositoryCommand) {
    const { category, color, description, name, tags, visibility } =
      command.dto;
    const { userId } = command;

    const owner = await this.userRepository.findById(userId);

    if (!owner) {
      throw new NotFoundException(REPOSITORY_MESSAGES.OWNER_NOT_FOUND);
    }

    const repositoryExists =
      await this.repositoryRepository.existsByNameAndOwnerUserId(name, userId);

    if (repositoryExists) {
      throw new ConflictException(REPOSITORY_MESSAGES.NAME_ALREADY_EXISTS);
    }

    const repositoryCategory =
      await this.repositoryCategoryRepository.findOrCreateByName(
        category.name,
        userId,
      );

    if (!repositoryCategory) {
      throw new BadRequestException(REPOSITORY_CATEGORY_MESSAGES.NOT_AVAILABLE);
    }

    const ownerRole =
      await this.repositoryRoleRepository.findByName(OWNER_ROLE_NAME);

    if (!ownerRole) {
      throw new NotFoundException(REPOSITORY_ROLE_MESSAGES.OWNER_NOT_FOUND);
    }

    const ownerFunction =
      await this.repositoryFunctionRepository.findByName(OWNER_FUNCTION_NAME);

    if (!ownerFunction) {
      throw new NotFoundException(REPOSITORY_FUNCTION_MESSAGES.OWNER_NOT_FOUND);
    }

    const repositoryTags: TagEntity[] = [];

    if (tags) {
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

    const repositoryEntity = new RepositoryEntity(
      null,
      repositoryCategory.id as number,
      userId,
      name,
      visibility,
      color,
      description ?? null,
      repositoryCategory,
      owner,
      repositoryTags,
      userId,
    );

    const repository = await this.repositoryRepository.create(
      repositoryEntity,
      ownerRole.id as number,
      ownerFunction.id as number,
    );

    return {
      message: REPOSITORY_MESSAGES.CREATED,
      data: RepositoryResponseMapper.toRepositoryResponse(
        repository,
        ownerRole,
        ownerFunction,
      ),
    };
  }
}
