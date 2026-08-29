import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { DeleteRepositoryCommand } from '@modules/repositories/application/commands/delete-repository/delete-repository.command';
import { REPOSITORY_MESSAGES } from '@modules/repositories/application/constants/repository-messages.constants';
import { RepositoryRepository } from '@modules/repositories/domain/repositories/repository.repository';

@CommandHandler(DeleteRepositoryCommand)
export class DeleteRepositoryHandler implements ICommandHandler<DeleteRepositoryCommand> {
  constructor(
    @Inject(RepositoryRepository)
    private readonly repositoryRepository: RepositoryRepository,
  ) {}

  async execute(command: DeleteRepositoryCommand) {
    const { id, userId } = command;

    await this.repositoryRepository.softDelete(id, userId);

    return {
      message: REPOSITORY_MESSAGES.DELETED,
    };
  }
}
