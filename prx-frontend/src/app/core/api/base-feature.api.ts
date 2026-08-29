import { HttpClient } from '@angular/common/http';
import { API_CONFIG } from '@core/config/api.config';
import { BaseApi } from '@core/api/base.api';

export abstract class BaseFeatureApi extends BaseApi {
  protected constructor(
    http: HttpClient,
    private readonly featureBasePath: string,
  ) {
    super(http);
  }

  protected buildUrl(path = ''): string {
    return `${API_CONFIG.baseUrl}${this.featureBasePath}${path}`;
  }
}
