import { BinnacleResponseDto } from '@modules/binnacles/application/dto/responses/binnacle-response.dto';
import { BinnacleEntity } from '@modules/binnacles/domain/entities/binnacle.entity';
import { PaginatedResponseDto } from '@shared/application/dto/paginated-response.dto';

export class BinnacleResponseMapper {
  static toBinnacleResponse(binnacle: BinnacleEntity): BinnacleResponseDto {
    return {
      id: binnacle.id as number,
      userId: binnacle.userId,
      content: binnacle.content,
      name: binnacle.name,
      createdAt: binnacle.createdAt as Date,
      updatedAt: binnacle.updatedAt as Date,
    };
  }

  static toPaginatedResponse(
    paginated: PaginatedResponseDto<BinnacleEntity>,
  ): PaginatedResponseDto<BinnacleResponseDto> {
    return {
      items: paginated.items.map((item) => this.toBinnacleResponse(item)),
      total: paginated.total,
      page: paginated.page,
      limit: paginated.limit,
    };
  }
}
