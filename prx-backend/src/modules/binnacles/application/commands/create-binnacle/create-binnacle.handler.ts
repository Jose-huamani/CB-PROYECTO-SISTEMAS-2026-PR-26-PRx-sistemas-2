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
    const { content, name } = command.dto;
    const { userId } = command;

    const binnacle = new BinnacleEntity(null, userId, content, name, userId);

    const savedBinnacle = await this.binnacleRepository.create(binnacle);

    return {
      message: BINNACLE_MESSAGES.CREATE.SUCCESS,
      data: BinnacleResponseMapper.toBinnacleResponse(savedBinnacle),
    };
  }
}
