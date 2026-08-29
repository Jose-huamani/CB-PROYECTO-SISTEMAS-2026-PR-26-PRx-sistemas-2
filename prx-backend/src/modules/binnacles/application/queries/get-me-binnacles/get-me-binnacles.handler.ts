import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { BinnacleResponseMapper } from '@modules/binnacles/application/mappers/binnacle-response.mapper';
import { BinnacleRepository } from '@modules/binnacles/domain/repositories/binnacle.repository';
import { GetMeBinnaclesQuery } from '@modules/binnacles/application/queries/get-me-binnacles/get-me-binnacles.query';

@QueryHandler(GetMeBinnaclesQuery)
export class GetMeBinnaclesHandler implements IQueryHandler<GetMeBinnaclesQuery> {
  constructor(
    @Inject(BinnacleRepository)
    private readonly binnacleRepository: BinnacleRepository,
  ) {}

  async execute(query: GetMeBinnaclesQuery) {
    const { page, limit } = query.dto;
    const { userId } = query;

    const binnacles = await this.binnacleRepository.findPaginatedMe(
      page,
      limit,
      userId,
    );

    return {
      data: BinnacleResponseMapper.toPaginatedResponse(binnacles),
    };
  }
}
