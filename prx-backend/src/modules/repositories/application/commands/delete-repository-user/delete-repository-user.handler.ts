import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { DeleteRepositoryUserCommand } from '@modules/repositories/application/commands/delete-repository-user/delete-repository-user.command';
import { REPOSITORY_MESSAGES } from '@modules/repositories/application/constants/repository-messages.constants';
import { REPOSITORY_ROLE_MESSAGES } from '@modules/repositories/application/constants/repository-role-messages.constants';
import { USER_MESSAGES } from '@modules/users/application/constants/user-messages.constants';
import { RepositoryRoleRepository } from '@modules/repositories/domain/repositories/repository-role.repository';
import { RepositoryUserRepository } from '@modules/repositories/domain/repositories/repository-user.repository';

const OWNER_ROLE_NAME = 'propietario';

@CommandHandler(DeleteRepositoryUserCommand)
export class DeleteRepositoryUserHandler implements ICommandHandler<DeleteRepositoryUserCommand> {
  constructor(
    @Inject(RepositoryUserRepository)
    private readonly repositoryUserRepository: RepositoryUserRepository,
    @Inject(RepositoryRoleRepository)
    private readonly repositoryRoleRepository: RepositoryRoleRepository,
  ) {}

  async execute(command: DeleteRepositoryUserCommand) {
    const { repositoryId, targetUserId, requestUserId } = command;

    const repositoryUser =
      await this.repositoryUserRepository.findByRepositoryIdAndUserId(
        repositoryId,
        targetUserId,
      );

    if (!repositoryUser) {
      throw new NotFoundException(USER_MESSAGES.NOT_FOUND_IN_REPOSITORY);
    }

    const ownerRole =
      await this.repositoryRoleRepository.findByName(OWNER_ROLE_NAME);

    if (ownerRole && repositoryUser.repositoryRoleId === ownerRole.id) {
      throw new BadRequestException(
        REPOSITORY_ROLE_MESSAGES.CANNOT_DELETE_OWNER,
      );
    }

    await this.repositoryUserRepository.softDelete(
      repositoryUser.id as number,
      requestUserId,
    );

    return {
      message: REPOSITORY_MESSAGES.USER_DELETED,
    };
  }
}
