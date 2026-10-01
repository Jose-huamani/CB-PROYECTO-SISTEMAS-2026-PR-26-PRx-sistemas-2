import { ForbiddenException, Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UpdateBinnacleCommand } from './update-binnacle.command';
import { BINNACLE_MESSAGES } from '@modules/binnacles/application/constants/binnacle-messages.constants';
import { BinnacleResponseMapper } from '@modules/binnacles/application/mappers/binnacle-response.mapper';
import { BinnacleRepository } from '@modules/binnacles/domain/repositories/binnacle.repository';

@CommandHandler(UpdateBinnacleCommand)
export class UpdateBinnacleHandler implements ICommandHandler<UpdateBinnacleCommand> {
  constructor(
    @Inject(BinnacleRepository)
    private readonly binnacleRepository: BinnacleRepository,
  ) {}

  async execute(command: UpdateBinnacleCommand) {
    const binnacle = await this.binnacleRepository.findById(command.id);

    if (!binnacle) {
      throw new NotFoundException(BINNACLE_MESSAGES.NOT_FOUND);
    }

    if (binnacle.userId !== command.userId) {
      throw new ForbiddenException(BINNACLE_MESSAGES.FORBIDDEN);
    }

    const updated = await this.binnacleRepository.update(command.id, {
      name: command.dto.name.trim(),
      content: command.dto.content.trim(),
      tasks: command.dto.tasks.map((task) => ({
        id: task.id,
        title: task.title.trim(),
        completed: task.completed,
      })),
      links: command.dto.links.map((link) => ({
        id: link.id,
        url: link.url.trim(),
      })),
      updatedBy: command.userId,
    });

    return {
      message: BINNACLE_MESSAGES.UPDATE.SUCCESS,
      data: BinnacleResponseMapper.toBinnacleResponse(updated),
    };
  }
}
