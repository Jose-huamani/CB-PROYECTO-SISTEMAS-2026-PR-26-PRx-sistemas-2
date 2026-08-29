import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseFeatureApi } from '@core/api/base-feature.api';
import { ApiResponseModel } from '@shared/models/api-response.model';
import { SOCIAL_NETWORK_API_CONFIG } from '@features/social-networks/infrastructure/config/social-network-api.config';
import { SocialNetworkModel } from '@features/social-networks/domain/models/social-network.model';

@Injectable({
    providedIn: 'root',
})
export class SocialNetworkApi extends BaseFeatureApi {
    private readonly publicHttp: HttpClient;

    constructor(http: HttpClient, httpBackend: HttpBackend) {
        super(http, SOCIAL_NETWORK_API_CONFIG.base);
        this.publicHttp = new HttpClient(httpBackend);
    }

    getSocialNetworks(): Observable<ApiResponseModel<SocialNetworkModel[]>> {
        return this.publicHttp.get<ApiResponseModel<SocialNetworkModel[]>>(
            this.buildUrl(SOCIAL_NETWORK_API_CONFIG.endpoints.getAll),
        );
    }
}
