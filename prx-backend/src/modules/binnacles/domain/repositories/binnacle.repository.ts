import { BinnacleEntity } from '@modules/binnacles/domain/entities/binnacle.entity';
import { PaginatedResponseDto } from '@shared/application/dto/paginated-response.dto';

export abstract class BinnacleRepository {
  abstract create(entity: BinnacleEntity): Promise<BinnacleEntity>;
  abstract findById(id: number): Promise<BinnacleEntity | null>;
  abstract findPaginatedMe(
    page: number,
    limit: number,
    userId: number,
  ): Promise<PaginatedResponseDto<BinnacleEntity>>;
  abstract softDelete(id: number, updatedBy: number): Promise<void>;
}
