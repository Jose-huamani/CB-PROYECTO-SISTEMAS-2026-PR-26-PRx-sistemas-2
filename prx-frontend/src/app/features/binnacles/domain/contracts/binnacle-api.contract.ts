import { Observable } from 'rxjs';
import { ApiResponseModel } from '@shared/models/api-response.model';
import { PaginatedResponseModel } from '@shared/models/paginated-response.model';
import { CreateBinnacleRequest } from '@features/binnacles/domain/requests/create-binnacle.request';
import { BinnacleModel } from '@features/binnacles/domain/models/binnacle.model';
import { GetMeBinnaclesRequest } from '@features/binnacles/domain/requests/get-me-binnacles.request';
import { UpdateBinnacleRequest } from '@features/binnacles/domain/requests/update-binnacle.request';

export abstract class BinnacleApiContract {
  abstract findPaginatedMe(
    data: GetMeBinnaclesRequest,
  ): Observable<ApiResponseModel<PaginatedResponseModel<BinnacleModel>>>;
  abstract create(data: CreateBinnacleRequest): Observable<ApiResponseModel<BinnacleModel>>;
  abstract findById(id: number): Observable<ApiResponseModel<BinnacleModel>>;
  abstract update(
    id: number,
    data: UpdateBinnacleRequest,
  ): Observable<ApiResponseModel<BinnacleModel>>;
  abstract deleteById(id: number): Observable<ApiResponseModel<void>>;
}
