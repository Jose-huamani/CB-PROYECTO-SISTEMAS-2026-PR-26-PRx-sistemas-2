import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { ApiResponseModel } from '@shared/models/api-response.model';
import { SocialNetworkApi } from '@features/social-networks/infrastructure/api/social-network.api';
import { SocialNetworkStore } from '@features/social-networks/infrastructure/store/social-network.store';
import { SocialNetworkModel } from '@features/social-networks/domain/models/social-network.model';

@Injectable({
    providedIn: 'root',
})
export class SocialNetworkFacade {
    private readonly socialNetworkApi = inject(SocialNetworkApi);
    private readonly socialNetworkStore = inject(SocialNetworkStore);

    readonly socialNetworks = this.socialNetworkStore.socialNetworks;

    loadSocialNetworks(): Observable<ApiResponseModel<SocialNetworkModel[]>> {
        return this.socialNetworkApi.getSocialNetworks().pipe(
            tap((response) => {
                if (response.data) {
                    this.socialNetworkStore.setSocialNetworks(response.data);
                }
            }),
        );
    }
}
