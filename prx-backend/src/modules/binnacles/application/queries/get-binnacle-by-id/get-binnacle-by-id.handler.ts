import { ForbiddenException, Inject, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { GetBinnacleByIdQuery } from './get-binnacle-by-id.query';
import { BINNACLE_MESSAGES } from '@modules/binnacles/application/constants/binnacle-messages.constants';
import { BinnacleResponseMapper } from '@modules/binnacles/application/mappers/binnacle-response.mapper';
import { BinnacleRepository } from '@modules/binnacles/domain/repositories/binnacle.repository';

@QueryHandler(GetBinnacleByIdQuery)
export class GetBinnacleByIdHandler implements IQueryHandler<GetBinnacleByIdQuery> {
  constructor(
    @Inject(BinnacleRepository)
    private readonly binnacleRepository: BinnacleRepository,
  ) {}

  async execute(query: GetBinnacleByIdQuery) {
    const binnacle = await this.binnacleRepository.findById(query.id);

    if (!binnacle) {
      throw new NotFoundException(BINNACLE_MESSAGES.NOT_FOUND);
    }

    if (binnacle.userId !== query.userId) {
      throw new ForbiddenException(BINNACLE_MESSAGES.FORBIDDEN);
    }

    return { data: BinnacleResponseMapper.toBinnacleResponse(binnacle) };
  }
}
