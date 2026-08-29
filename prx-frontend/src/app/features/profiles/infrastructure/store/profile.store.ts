import { Injectable, computed, signal } from '@angular/core';

import { ProfileModel } from '@features/profiles/domain/models/profile.model';
import { CountryModel } from '@features/profiles/domain/models/country.model';
import { TagModel } from '@features/profiles/domain/models/tag.model';

@Injectable({
  providedIn: 'root',
})
export class ProfileStore {
  private readonly profileSignal = signal<ProfileModel | null>(null);
  private readonly loadingSignal = signal(false);
  private readonly countriesSignal = signal<CountryModel[]>([]);
  private readonly tagsSignal = signal<TagModel[]>([]);

  readonly profile = computed(() => this.profileSignal());
  readonly loading = computed(() => this.loadingSignal());
  readonly countries = computed(() => this.countriesSignal());
  readonly tags = computed(() => this.tagsSignal());

  setProfile(profile: ProfileModel | null): void {
    this.profileSignal.set(profile);
  }

  setLoading(value: boolean): void {
    this.loadingSignal.set(value);
  }

  setCountries(countries: CountryModel[]): void {
    this.countriesSignal.set(countries || []);
  }

  setTags(tags: TagModel[]): void {
    this.tagsSignal.set(tags || []);
  }

  clearCountries(): void {
    this.countriesSignal.set([]);
  }

  clearTags(): void {
    this.tagsSignal.set([]);
  }

  clear(): void {
    this.profileSignal.set(null);
    this.loadingSignal.set(false);
    this.countriesSignal.set([]);
    this.tagsSignal.set([]);
  }
}
