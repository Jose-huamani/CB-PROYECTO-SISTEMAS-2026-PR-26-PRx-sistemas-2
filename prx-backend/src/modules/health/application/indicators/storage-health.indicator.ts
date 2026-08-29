import { Injectable } from '@nestjs/common';
import {
  HealthIndicatorResult,
  HealthIndicatorService,
} from '@nestjs/terminus';

import { TigrisStorageService } from '@shared/infrastructure/storage/tigris-storage.service';

@Injectable()
export class StorageHealthIndicator {
  constructor(
    private readonly tigrisStorageService: TigrisStorageService,
    private readonly healthIndicatorService: HealthIndicatorService,
  ) {}

  async isHealthy(
    key: string,
    isPublic: boolean,
  ): Promise<HealthIndicatorResult> {
    const indicator = this.healthIndicatorService.check(key);

    try {
      await this.tigrisStorageService.verifyConnection(isPublic);

      return indicator.up();
    } catch {
      return indicator.down();
    }
  }
}
