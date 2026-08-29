import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, computed, inject, signal, effect } from '@angular/core';
import { FormsModule, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { SkeletonModule } from 'primeng/skeleton';
import { finalize } from 'rxjs';

import { AuthStore } from '@features/auth/infrastructure/store/auth.store';
import { buildEditProfileFormFields } from '@features/profiles/application/forms/edit-profile.form';
import { ProfileFacade } from '@features/profiles/application/facades/profile.facade';
import { ProfileSocialNetworkModel } from '@features/profiles/domain/models/profile-social-network.model';
import { ProfileSocialNetworkRequest } from '@features/profiles/domain/requests/profile-social-network.request';
import { TagRequest } from '@features/profiles/domain/requests/tag.request';
import { UpdateProfileRequest } from '@features/profiles/domain/requests/update-profile.request';
import { SocialNetworkFacade } from '@features/social-networks/application/facades/social-network.facade';
import { SocialNetworkModel } from '@features/social-networks/domain/models/social-network.model';
import { NotificationService } from '@core/services/notification.service';
import { UI_MESSAGES } from '@shared/constants/ui-messages.constants';
import { NotificationMessage } from '@shared/types/notification-message.type';
import { PROFILE_UI_MESSAGES } from '@features/profiles/constants/profile-ui-messages.constants';
import {
  getApiErrorNotificationMessage,
  getApiNotificationMessage,
} from '@shared/utils/api-notification.util';
import { resolvePublicStorageUrl } from '@shared/utils/storage-url.util';

interface ProfileFormModel {
  email: string;
  firstName: string;
  lastName: string;
  secondLastName: string;
  phoneCodeId: number | null;
  phoneNumber: string;
  biography?: string | null;
  countryId: number | null;
  regionName: string | null;
  townName: string | null;
  isEmailVisible: boolean;
  tags: string[];
}

@Component({
  selector: 'app-edit-profile-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormlyModule,
    AvatarModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    SkeletonModule,
    RouterLink,
  ],
  templateUrl: './edit-profile-page.component.html',
  styleUrl: './edit-profile-page.component.scss',
})
export class EditProfilePageComponent implements OnInit {
  private readonly profileFacade = inject(ProfileFacade);
  private readonly socialNetworkFacade = inject(SocialNetworkFacade);
  private readonly authStore = inject(AuthStore);
  private readonly notificationService = inject(NotificationService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  @ViewChild('avatarInput') private readonly avatarInput?: ElementRef<HTMLInputElement>;

  protected readonly form = new FormGroup({});
  protected fields: FormlyFieldConfig[] = buildEditProfileFormFields({
    countries: [],
    tagSuggestions: [],
    searchTags: (event) => {
      this.searchTags(event);
    },
  });
  protected readonly rebuildFieldsEffect = effect(() => {
    const countries = this.profileFacade.countries();
    const tags = this.profileFacade.tags();

    const mappedCountries = (countries ?? []).map((c) => ({
      ...c,
      label: `${c.phoneCode ? c.phoneCode + ' ' : ''}${c.name}`.trim(),
    }));

    this.fields = buildEditProfileFormFields({
      countries: mappedCountries,
      tagSuggestions: tags ?? [],
      searchTags: (event) => {
        this.searchTags(event);
      },
    });
  });
  protected readonly submitting = signal(false);
  protected readonly loading = signal(false);
  protected readonly avatarPreviewUrl = signal<string | null>(null);
  private hasExistingProfile = false;
  private avatarObjectUrl: string | null = null;
  protected readonly socialNetworks = this.socialNetworkFacade.socialNetworks;
  protected readonly socialNetworkValues: Record<number, string> = {};
  protected readonly syncAvatarEffect = effect(() => {
    if (this.avatarImageUrl) {
      this.setAvatarPreviewUrl(this.avatarImageUrl);
    }
  });

  protected readonly username = computed(() =>
    this.authStore.currentUser()
      ? (this.authStore.currentUser()?.username ?? 'Usuario')
      : 'Usuario',
  );

  protected model: ProfileFormModel = {
    email: this.authStore.currentUser()?.email ?? '',
    firstName: '',
    lastName: '',
    secondLastName: '',
    phoneCodeId: null,
    phoneNumber: '',
    biography: '',
    countryId: null,
    regionName: null,
    townName: null,
    isEmailVisible: false,
    tags: [],
  };

  ngOnInit(): void {
    this.model.email = this.authStore.currentUser()?.email ?? '';
    this.setAvatarPreviewUrl(
      this.profileFacade.profile()?.avatarUrl
        ? resolvePublicStorageUrl(this.profileFacade.profile()!.avatarUrl)
        : null,
    );
    this.profileFacade.loadCountries();
    this.profileFacade.loadTags();
    this.socialNetworkFacade.loadSocialNetworks().subscribe({ next: () => { }, error: () => { } });
    this.loadProfile();
  }

  protected openAvatarPicker(): void {
    this.avatarInput?.nativeElement.click();
  }

  protected onAvatarSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.notificationService.warn(
        PROFILE_UI_MESSAGES.AVATAR_TITLE,
        PROFILE_UI_MESSAGES.IMAGE_TOO_LARGE,
      );
      input.value = '';
      return;
    }

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      this.notificationService.warn(
        PROFILE_UI_MESSAGES.AVATAR_TITLE,
        PROFILE_UI_MESSAGES.INVALID_IMAGE_TYPE,
      );
      input.value = '';
      return;
    }

    this.avatarObjectUrl = URL.createObjectURL(file);
    this.avatarPreviewUrl.set(this.avatarObjectUrl);
    this.profileFacade.updateAvatar(file);
    input.value = '';
  }

  protected submit(): void {
    if (this.submitting()) {
      return;
    }

    if (this.form.invalid) {
      this.handleInvalidForm();
      return;
    }

    const profileId = this.getProfileId();

    const request = this.buildUpdateRequest();

    this.submitting.set(true);

    if (profileId && this.hasExistingProfile) {
      this.profileFacade
        .updateProfile(request)
        .pipe(
          finalize(() => {
            this.submitting.set(false);
          }),
        )
        .subscribe({
          next: (response) => {
            this.handleUpdateSuccess(
              getApiNotificationMessage(response, PROFILE_UI_MESSAGES.PROFILE_UPDATED_SUCCESS),
            );
            const userId = this.authStore.currentUser()?.id;
            if (userId) {
              void this.router.navigate(['/profiles/view', String(userId)]);
            }
          },
          error: (error: HttpErrorResponse) => {
            this.handleUpdateError(
              getApiErrorNotificationMessage(error, PROFILE_UI_MESSAGES.PROFILE_UPDATED_ERROR),
            );
          },
        });
    } else {
      this.profileFacade
        .createProfile(request)
        .pipe(
          finalize(() => {
            this.submitting.set(false);
          }),
        )
        .subscribe({
          next: (response) => {
            this.handleUpdateSuccess(
              getApiNotificationMessage(response, PROFILE_UI_MESSAGES.PROFILE_CREATED_SUCCESS),
            );
            const userId = this.authStore.currentUser()?.id;
            if (userId) {
              void this.router.navigate(['/profiles/view', String(userId)]);
            }
          },
          error: (error: HttpErrorResponse) => {
            this.handleUpdateError(
              getApiErrorNotificationMessage(error, PROFILE_UI_MESSAGES.PROFILE_CREATE_ERROR),
            );
          },
        });
    }
  }

  private loadProfile(): void {
    const profileId = this.getProfileId();
    if (!profileId) {
      this.hasExistingProfile = false;
      return;
    }

    this.loading.set(true);

    this.profileFacade
      .getProfile()
      .pipe(
        finalize(() => {
          this.loading.set(false);
        }),
      )
      .subscribe({
        next: (response) => {
          if (response.data) {
            this.hasExistingProfile = true;
            this.applySocialNetworkValues(response.data.socialNetworks ?? []);

            this.model = {
              email: response.data.email ?? this.model.email,
              firstName: response.data.firstName ?? '',
              lastName: response.data.lastName ?? '',
              secondLastName: response.data.secondLastName ?? '',
              phoneCodeId: response.data.phoneCodeId ?? null,
              phoneNumber: response.data.phoneNumber ?? '',
              biography: response.data.biography ?? '',
              countryId: response.data.countryId ?? null,
              regionName: (response.data.regionName as string) || null,
              townName: (response.data.townName as string) || null,
              isEmailVisible: response.data.isEmailVisible ?? false,
              tags: response.data.tags?.map((tag) =>
                typeof tag === 'string' ? tag : tag.name,
              ) ?? [],
            };

            this.form.reset(this.model);

            this.setAvatarPreviewUrl(
              response.data.avatarUrl
                ? resolvePublicStorageUrl(response.data.avatarUrl)
                : this.avatarPreviewUrl(),
            );
          }
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 404) {
            this.hasExistingProfile = false;
            return;
          }

          this.notificationService.error(
            PROFILE_UI_MESSAGES.ERROR_TITLE,
            getApiErrorNotificationMessage(error, PROFILE_UI_MESSAGES.PROFILE_LOAD_ERROR),
          );
        },
      });
  }

  private getProfileId(): string | null {
    return this.route.snapshot.paramMap.get('id') ?? this.authStore.currentUser()?.id?.toString() ?? null;
  }

  private buildUpdateRequest(): UpdateProfileRequest {
    const rawValue = this.form.getRawValue() as ProfileFormModel;
    return {
      firstName: rawValue.firstName.trim() || null,
      lastName: rawValue.lastName.trim() || null,
      secondLastName: rawValue.secondLastName.trim() || null,
      biography: (rawValue.biography ?? '').trim() || null,
      phoneNumber: rawValue.phoneNumber.trim() || null,
      phoneCodeId: rawValue.phoneCodeId,
      countryId: rawValue.countryId,
      regionName: rawValue.regionName?.trim() || null,
      townName: rawValue.townName?.trim() || null,
      isEmailVisible: !!rawValue.isEmailVisible,
      socialNetworks: this.buildSocialNetworks(),
      tags: this.buildTags(
        (rawValue.tags || [])
          .map((t: string | { name?: string }) => (typeof t === 'string' ? t : t.name ?? ''))
          .filter(Boolean),
      ),
    };
  }

  private handleInvalidForm(): void {
    this.markFormAsTouched();
    this.notificationService.warn(
      PROFILE_UI_MESSAGES.FORM_TITLE,
      UI_MESSAGES.FORM.INVALID_GENERIC,
    );
  }

  private handleUpdateSuccess(message: NotificationMessage): void {
    this.notificationService.success(PROFILE_UI_MESSAGES.SUCCESS_TITLE, message);
  }

  private handleUpdateError(message: NotificationMessage): void {
    this.notificationService.error(PROFILE_UI_MESSAGES.ERROR_TITLE, message);
  }

  private markFormAsTouched(): void {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();
  }

  protected goBack(): void {
    this.router.navigate(['/']);
  }

  protected cancel(): void {
    const profileId = this.getProfileId();

    if (profileId) {
      void this.router.navigate(['/profiles/view', String(profileId)]);
      return;
    }

    this.goBack();
  }

  protected trackSocialNetworkById(_index: number, socialNetwork: SocialNetworkModel): number {
    return socialNetwork.id;
  }

  private applySocialNetworkValues(socialNetworks: ProfileSocialNetworkModel[]): void {
    socialNetworks.forEach((socialNetwork) => {
      this.socialNetworkValues[socialNetwork.socialNetworkId] = socialNetwork.username ?? '';
    });
  }

  private buildSocialNetworks(): ProfileSocialNetworkRequest[] {
    const catalog = this.socialNetworks();
    if (!catalog.length) {
      return [];
    }

    return catalog
      .map((network) => ({
        socialNetworkId: network.id,
        username: (this.socialNetworkValues[network.id] ?? '').trim(),
      }))
      .filter((entry) => entry.username.length > 0);
  }

  private buildTags(tags: unknown[]): TagRequest[] {
    const uniqueTags = [
      ...new Set(
        (tags ?? [])
          .map((tag) => (typeof tag === 'string' ? tag : (tag as { name?: string }).name ?? ''))
          .map((tag) => tag.trim())
          .filter(Boolean),
      ),
    ];

    return uniqueTags.slice(0, 5).map((name) => ({
      name,
    }));
  }

  private normalizeTagValue(tag: unknown): string {
    if (typeof tag === 'string') {
      return tag.trim();
    }

    if (!tag || typeof tag !== 'object') {
      return '';
    }

    const record = tag as Record<string, unknown>;
    const value = record["name"];

    if (typeof value !== 'string') {
      return '';
    }

    return value.trim();
  }

  private searchTags(event: AutoCompleteCompleteEvent): void {
    this.profileFacade.loadTags(event.query);
  }

  private setAvatarPreviewUrl(url: string | null): void {
    if (this.avatarObjectUrl && this.avatarObjectUrl !== url) {
      URL.revokeObjectURL(this.avatarObjectUrl);
      this.avatarObjectUrl = null;
    }

    this.avatarPreviewUrl.set(url);
  }

  protected get avatarImageUrl(): string | null {
    const previewUrl = this.avatarPreviewUrl();
    if (previewUrl) {
      return previewUrl;
    }

    const profile = this.profileFacade.profile();
    const url = profile?.avatarUrl;

    if (!url) {
      return null;
    }

    return resolvePublicStorageUrl(url);
  }
}
