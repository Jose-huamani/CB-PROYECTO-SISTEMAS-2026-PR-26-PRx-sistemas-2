import { Injectable, effect, inject } from '@angular/core';
import { Observable, finalize, tap } from 'rxjs';

import { AuthStore } from '@features/auth/infrastructure/store/auth.store';
import { ProfileApi } from '@features/profiles/infrastructure/api/profile.api';
import { ProfileStore } from '@features/profiles/infrastructure/store/profile.store';
import { ProfileModel } from '@features/profiles/domain/models/profile.model';
import { UpdateProfileRequest } from '@features/profiles/domain/requests/update-profile.request';
import { ApiResponseModel } from '@shared/models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class ProfileFacade {
  private readonly profileApi = inject(ProfileApi);
  private readonly profileStore = inject(ProfileStore);
  private readonly authStore = inject(AuthStore);
  private readonly profileUserIdEffect = effect(() => {
    const currentUserId = this.authStore.currentUser()?.id ?? null;

    if (this.lastUserId !== currentUserId) {
      this.profileStore.clear();
      this.lastUserId = currentUserId;
    }
  });

  private lastUserId: number | null = null;

  readonly profile = this.profileStore.profile;
  readonly loading = this.profileStore.loading;
  readonly countries = this.profileStore.countries;
  readonly tags = this.profileStore.tags;

  clearProfile(): void {
    this.profileStore.clear();
  }

  getProfile(): Observable<ApiResponseModel<ProfileModel>> {
    return this.executeWithLoading(this.profileApi.getProfile()).pipe(
      tap((response) => {
        if (response.data) {
          this.profileStore.setProfile(response.data);
        }
      }),
    );
  }

  updateProfile(data: UpdateProfileRequest): Observable<ApiResponseModel<ProfileModel>> {
    return this.executeWithLoading(this.profileApi.updateProfile(data)).pipe(
      tap((response) => {
        if (response.data) {
          this.profileStore.setProfile(response.data);
        }
      }),
    );
  }

  updateAvatar(file: File): void {
    this.executeWithLoading(this.profileApi.updateAvatar(file)).pipe(
      tap((response) => {
        if (response.data) {
          this.profileStore.setProfile(response.data);
        }
      }),
    ).subscribe({ next: () => { }, error: () => { } });
  }

  createProfile(
    data: UpdateProfileRequest,
  ): Observable<ApiResponseModel<ProfileModel>> {
    return this.executeWithLoading(this.profileApi.createProfile(data)).pipe(
      tap((response) => {
        if (response.data) {
          this.profileStore.setProfile(response.data);
        }
      }),
    );
  }

  loadCountries(): void {
    this.executeWithLoading(this.profileApi.getCountries()).pipe(
      tap((response) => {
        if (response.data) {
          this.profileStore.setCountries(response.data);
        }
      }),
    ).subscribe({ next: () => { }, error: () => { } });
  }

  loadTags(search = ''): void {
    this.executeWithLoading(this.profileApi.getTags({ search, limit: 10 })).pipe(
      tap((response) => {
        if (response.data) {
          this.profileStore.setTags(response.data);
        }
      }),
    ).subscribe({ next: () => { }, error: () => { } });
  }

  getPublicProfile(id: number) {
    return this.executeWithLoading(this.profileApi.getPublicProfile(id));
  }

  private executeWithLoading<T>(source$: Observable<T>): Observable<T> {
    this.profileStore.setLoading(true);

    return source$.pipe(
      finalize(() => {
        this.profileStore.setLoading(false);
      }),
    );
  }
}
