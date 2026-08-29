import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseFeatureApi } from '@core/api/base-feature.api';
import { BinnacleApiContract } from '@features/binnacles/domain/contracts/binnacle-api.contract';
import { BinnacleModel } from '@features/binnacles/domain/models/binnacle.model';
import { ApiResponseModel } from '@shared/models/api-response.model';
import { PaginatedResponseModel } from '@shared/models/paginated-response.model';
import { BINNACLE_API_CONFIG } from '@features/binnacles/infrastructure/config/binnacle-api.config';
import { CreateBinnacleRequest } from '@features/binnacles/domain/requests/create-binnacle.request';
import { GetMeBinnaclesRequest } from '@features/binnacles/domain/requests/get-me-binnacles.request';

@Injectable({
  providedIn: 'root',
})
export class BinnacleApi extends BaseFeatureApi implements BinnacleApiContract {
  constructor(http: HttpClient) {
    super(http, BINNACLE_API_CONFIG.base);
  }

  findPaginatedMe(
    data: GetMeBinnaclesRequest,
  ): Observable<ApiResponseModel<PaginatedResponseModel<BinnacleModel>>> {
    return this.get<PaginatedResponseModel<BinnacleModel>>(
      this.buildUrl(BINNACLE_API_CONFIG.endpoints.findPaginatedMe),
      { page: data.page, limit: data.limit },
    );
  }

  create(data: CreateBinnacleRequest): Observable<ApiResponseModel<BinnacleModel>> {
    return this.post<BinnacleModel>(this.buildUrl(BINNACLE_API_CONFIG.endpoints.create), data);
  }

  deleteById(id: number): Observable<ApiResponseModel<void>> {
    return this.delete<void>(
      this.buildUrl(BINNACLE_API_CONFIG.endpoints.delete.replace(':id', id.toString())),
    );
  }
}
