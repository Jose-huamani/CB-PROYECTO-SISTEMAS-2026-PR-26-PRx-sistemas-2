import { Injectable, computed, signal } from '@angular/core';

import { AUTH_STORAGE_CONSTANTS } from '@shared/constants/auth-storage.constants';
import { CurrentUserModel } from '@shared/models/current-user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthStore {
  private readonly currentUserSignal = signal<CurrentUserModel | null>(this.getStoredCurrentUser());

  private readonly loadingSignal = signal(false);

  private readonly storageListener = (event: StorageEvent): void => {
    if (event.key === AUTH_STORAGE_CONSTANTS.CURRENT_USER) {
      this.currentUserSignal.set(this.getStoredCurrentUser());
    }
  };

  readonly currentUser = computed(() => this.currentUserSignal());
  readonly isAuthenticated = computed(() => !!this.currentUserSignal());
  readonly loading = computed(() => this.loadingSignal());

  constructor() {
    this.initStorageListener();
  }

  setCurrentUser(user: CurrentUserModel | null): void {
    this.currentUserSignal.set(user);

    if (!user) {
      this.removeStoredCurrentUser();
      return;
    }

    this.setStoredCurrentUser(user);
  }

  setLoading(value: boolean): void {
    this.loadingSignal.set(value);
  }

  clear(): void {
    this.currentUserSignal.set(null);
    this.loadingSignal.set(false);
    this.removeStoredCurrentUser();
  }

  private initStorageListener(): void {
    window.addEventListener('storage', this.storageListener);
  }

  private getStoredCurrentUser(): CurrentUserModel | null {
    const value = localStorage.getItem(AUTH_STORAGE_CONSTANTS.CURRENT_USER);

    if (!value) {
      return null;
    }

    try {
      return JSON.parse(value) as CurrentUserModel;
    } catch {
      this.removeStoredCurrentUser();
      return null;
    }
  }

  private setStoredCurrentUser(user: CurrentUserModel): void {
    localStorage.setItem(AUTH_STORAGE_CONSTANTS.CURRENT_USER, JSON.stringify(user));
  }

  private removeStoredCurrentUser(): void {
    localStorage.removeItem(AUTH_STORAGE_CONSTANTS.CURRENT_USER);
  }
}
