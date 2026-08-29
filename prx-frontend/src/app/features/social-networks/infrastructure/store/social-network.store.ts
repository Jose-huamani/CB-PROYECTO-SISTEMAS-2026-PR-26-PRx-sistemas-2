import { Injectable, computed, signal } from '@angular/core';

import { SocialNetworkModel } from '@features/social-networks/domain/models/social-network.model';

@Injectable({
    providedIn: 'root',
})
export class SocialNetworkStore {
    private readonly socialNetworksSignal = signal<SocialNetworkModel[]>([]);

    readonly socialNetworks = computed(() => this.socialNetworksSignal());

    setSocialNetworks(socialNetworks: SocialNetworkModel[]): void {
        this.socialNetworksSignal.set(socialNetworks || []);
    }

    clear(): void {
        this.socialNetworksSignal.set([]);
    }
}
