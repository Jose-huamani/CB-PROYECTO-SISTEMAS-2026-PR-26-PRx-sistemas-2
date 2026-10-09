import { Injectable, inject } from '@angular/core';
import { Observable, finalize, tap } from 'rxjs';
import { BinnacleApi } from '@features/binnacles/infrastructure/api/binnacle.api';
import { BinnacleStore } from '@features/binnacles/infrastructure/store/binnacle.store';
import { BinnacleModel } from '@features/binnacles/domain/models/binnacle.model';
import { ApiResponseModel } from '@shared/models/api-response.model';
import { CreateBinnacleRequest } from '@features/binnacles/domain/requests/create-binnacle.request';
import { GetMeBinnaclesRequest } from '@features/binnacles/domain/requests/get-me-binnacles.request';
import { UpdateBinnacleRequest } from '@features/binnacles/domain/requests/update-binnacle.request';

@Injectable({
  providedIn: 'root',
})
export class BinnacleFacade {
  private readonly binnacleApi = inject(BinnacleApi);
  private readonly binnacleStore = inject(BinnacleStore);

  readonly binnacles = this.binnacleStore.binnacles;
  readonly loading = this.binnacleStore.loading;
  readonly total = this.binnacleStore.total;
  readonly page = this.binnacleStore.page;
  readonly limit = this.binnacleStore.limit;

  findPaginatedMe(data: GetMeBinnaclesRequest): void {
    this.binnacleStore.setLoading(true);
    this.binnacleStore.setPage(data.page);
    this.binnacleStore.setLimit(data.limit);

    this.binnacleApi.findPaginatedMe(data).subscribe({
      next: (response) => {
        if (response.data) {
          this.binnacleStore.setBinnacles(response.data.items);
          this.binnacleStore.setTotal(response.data.total);
        }
        this.binnacleStore.setLoading(false);
      },
      error: (error) => {
        console.error('Error:', error);
        this.binnacleStore.setLoading(false);
      },
    });
  }

  create(data: CreateBinnacleRequest): Observable<ApiResponseModel<BinnacleModel>> {
    this.binnacleStore.setLoading(true);
    return this.binnacleApi.create(data).pipe(finalize(() => this.binnacleStore.setLoading(false)));
  }

  findById(id: number): Observable<ApiResponseModel<BinnacleModel>> {
    return this.binnacleApi.findById(id);
  }

  update(id: number, data: UpdateBinnacleRequest): Observable<ApiResponseModel<BinnacleModel>> {
    return this.binnacleApi.update(id, data);
  }

  delete(id: number): Observable<ApiResponseModel<void>> {
    this.binnacleStore.setLoading(true);
    return this.binnacleApi
      .deleteById(id)
      .pipe(finalize(() => this.binnacleStore.setLoading(false)));
  }

  reset(): void {
    this.binnacleStore.clear();
  }
}
