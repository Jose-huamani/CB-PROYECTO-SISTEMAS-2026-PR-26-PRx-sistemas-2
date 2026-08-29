import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';

import { AuthStore } from '@features/auth/infrastructure/store/auth.store';
import { ProfileFacade } from '@features/profiles/application/facades/profile.facade';
import { ProfileModel } from '@features/profiles/domain/models/profile.model';
import { UserPublicRepositoriesComponent } from '@features/repositories/presentation/components/user-public-repositories/user-public-repositories.component';
import { SocialNetworkFacade } from '@features/social-networks/application/facades/social-network.facade';
import { resolvePublicStorageUrl } from '@shared/utils/storage-url.util';

@Component({
  selector: 'app-profile-public-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    AvatarModule,
    ButtonModule,
    CardModule,
    SkeletonModule,
    TagModule,
    UserPublicRepositoriesComponent,
  ],
  templateUrl: './profile-public-page.component.html',
  styleUrl: './profile-public-page.component.scss',
})
export class ProfilePublicPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly profileFacade = inject(ProfileFacade);
  private readonly authStore = inject(AuthStore);
  private readonly socialNetworkFacade = inject(SocialNetworkFacade);

  protected readonly loading = signal(true);
  protected readonly profileNotFound = signal(false);
  protected readonly profile = signal<ProfileModel | null>(null);
  protected readonly profileUserId = signal<number | null>(null);

  protected readonly socialNetworks = this.socialNetworkFacade.socialNetworks;
  protected readonly currentUser = this.authStore.currentUser;

  protected readonly isOwner = computed(() => {
    const currentUser = this.currentUser();
    const profileUserId = this.profileUserId();

    return !!currentUser && !!profileUserId && currentUser.id === profileUserId;
  });

  protected readonly resolvedSocialNetworks = computed(() => {
    const profile = this.profile();
    const catalog = this.socialNetworks();

    if (!profile?.socialNetworks?.length || !catalog.length) {
      return [];
    }

    return profile.socialNetworks
      .map((entry) => {
        const socialNetwork = catalog.find((item) => item.id === entry.socialNetworkId);

        if (!socialNetwork || !entry.username) {
          return null;
        }

        return {
          id: entry.socialNetworkId,
          name: socialNetwork.name,
          icon: socialNetwork.icon,
          username: entry.username,
          url: `${socialNetwork.baseUrl}${entry.username}`,
        };
      })
      .filter(Boolean) as Array<{
        id: number;
        name: string;
        icon: string;
        username: string;
        url: string;
      }>;
  });

  ngOnInit(): void {
    this.socialNetworkFacade.loadSocialNetworks().subscribe({
      next: () => { },
      error: () => { },
    });

    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));

      if (!Number.isInteger(id) || id <= 0) {
        this.profileUserId.set(null);
        this.profile.set(null);
        this.profileNotFound.set(true);
        this.loading.set(false);
        return;
      }

      this.profileUserId.set(id);
      this.loadProfile(id);
    });
  }

  protected getLocationLabel(profile: ProfileModel): string {
    return [profile.countryName, profile.regionName, profile.townName]
      .map((value) => value?.trim() ?? '')
      .filter(Boolean)
      .join(' / ');
  }

  protected get avatarImageUrl(): string | null {
    const profile = this.profile();
    const url = profile?.avatarUrl;

    if (!url) {
      return null;
    }

    return resolvePublicStorageUrl(url);
  }

  private loadProfile(id: number): void {
    this.loading.set(true);
    this.profile.set(null);
    this.profileNotFound.set(false);

    this.profileFacade.getPublicProfile(id).subscribe({
      next: (res) => {
        const profile = res.data ?? null;

        this.profile.set(profile);
        this.profileNotFound.set(!profile);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);

        const currentUserId = this.currentUser()?.id;

        if (currentUserId && currentUserId === id) {
          void this.router.navigate(['/profiles/edit']);
          return;
        }

        this.profile.set(null);
        this.profileNotFound.set(true);
      },
    });
  }
}
