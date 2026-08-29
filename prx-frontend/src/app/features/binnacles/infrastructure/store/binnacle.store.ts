import { Injectable, signal, computed } from '@angular/core';
import { BinnacleModel } from '@features/binnacles/domain/models/binnacle.model';

@Injectable({
  providedIn: 'root',
})
export class BinnacleStore {
  private readonly binnaclesSignal = signal<BinnacleModel[]>([]);
  private readonly loadingSignal = signal(false);
  private readonly totalSignal = signal(0);
  private readonly pageSignal = signal(1);
  private readonly limitSignal = signal(10);

  readonly binnacles = computed(() => this.binnaclesSignal());
  readonly loading = computed(() => this.loadingSignal());
  readonly total = computed(() => this.totalSignal());
  readonly page = computed(() => this.pageSignal());
  readonly limit = computed(() => this.limitSignal());

  setBinnacles(binnacles: BinnacleModel[]): void {
    this.binnaclesSignal.set(binnacles);
  }

  setLoading(loading: boolean): void {
    this.loadingSignal.set(loading);
  }

  setTotal(total: number): void {
    this.totalSignal.set(total);
  }

  setPage(page: number): void {
    this.pageSignal.set(page);
  }

  setLimit(limit: number): void {
    this.limitSignal.set(limit);
  }

  clear(): void {
    this.binnaclesSignal.set([]);
    this.loadingSignal.set(false);
    this.totalSignal.set(0);
    this.pageSignal.set(1);
    this.limitSignal.set(10);
  }
}
