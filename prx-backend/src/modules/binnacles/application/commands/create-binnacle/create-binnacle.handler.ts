import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateBinnacleCommand } from './create-binnacle.command';
import { BinnacleRepository } from '@modules/binnacles/domain/repositories/binnacle.repository';
import { BinnacleEntity } from '@modules/binnacles/domain/entities/binnacle.entity';
import { Inject } from '@nestjs/common';
import { BINNACLE_MESSAGES } from '@modules/binnacles/application/constants/binnacle-messages.constants';
import { BinnacleResponseMapper } from '@modules/binnacles/application/mappers/binnacle-response.mapper';

@CommandHandler(CreateBinnacleCommand)
export class CreateBinnacleHandler implements ICommandHandler<CreateBinnacleCommand> {
  constructor(
    @Inject(BinnacleRepository)
    private readonly binnacleRepository: BinnacleRepository,
  ) {}
  async execute(command: CreateBinnacleCommand) {
    const { content, name, tasks = [], links = [] } = command.dto;
    const { userId } = command;

    const normalizedTasks = tasks.map((task) => ({
      id: task.id,
      title: task.title.trim(),
      completed: task.completed,
    }));
    const normalizedLinks = links.map((link) => ({
      id: link.id,
      url: link.url.trim(),
    }));

    const binnacle = new BinnacleEntity(
      null,
      userId,
      content,
      name,
      userId,
      undefined,
      undefined,
      undefined,
      undefined,
      normalizedTasks,
      normalizedLinks,
    );

    const savedBinnacle = await this.binnacleRepository.create(binnacle);

    return {
      message: BINNACLE_MESSAGES.CREATE.SUCCESS,
      data: BinnacleResponseMapper.toBinnacleResponse(savedBinnacle),
    };
  }
}
