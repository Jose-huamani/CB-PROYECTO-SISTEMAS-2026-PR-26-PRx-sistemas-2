import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteBinnacleCommand } from './delete-binnacle.command';
import { BinnacleRepository } from '@modules/binnacles/domain/repositories/binnacle.repository';
import {
  Inject,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { BINNACLE_MESSAGES } from '@modules/binnacles/application/constants/binnacle-messages.constants';

@CommandHandler(DeleteBinnacleCommand)
export class DeleteBinnacleHandler implements ICommandHandler<DeleteBinnacleCommand> {
  constructor(
    @Inject(BinnacleRepository)
    private readonly binnacleRepository: BinnacleRepository,
  ) {}

  async execute(command: DeleteBinnacleCommand) {
    const binnacle = await this.binnacleRepository.findById(command.id);

    if (!binnacle) {
      throw new NotFoundException(BINNACLE_MESSAGES.NOT_FOUND);
    }

    await this.binnacleRepository.softDelete(command.id, command.userId);

    return {
      message: BINNACLE_MESSAGES.DELETE.SUCCESS,
    };
  }
}
