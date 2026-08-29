import { Injectable, signal } from '@angular/core';
import { AUTH_STORAGE_CONSTANTS } from '@shared/constants/auth-storage.constants';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly accessTokenSignal = signal<string | null>(this.getStoredAccessToken());
  private readonly refreshTokenSignal = signal<string | null>(this.getStoredRefreshToken());

  private readonly storageListener = (event: StorageEvent): void => {
    if (
      event.key === AUTH_STORAGE_CONSTANTS.ACCESS_TOKEN ||
      event.key === AUTH_STORAGE_CONSTANTS.REFRESH_TOKEN
    ) {
      this.syncTokensFromStorage();
    }
  };

  constructor() {
    this.initStorageListener();
  }

  accessToken(): string | null {
    return this.accessTokenSignal();
  }

  refreshToken(): string | null {
    return this.refreshTokenSignal();
  }

  hasAccessToken(): boolean {
    return !!this.accessTokenSignal();
  }

  hasRefreshToken(): boolean {
    return !!this.refreshTokenSignal();
  }

  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(AUTH_STORAGE_CONSTANTS.ACCESS_TOKEN, accessToken);
    localStorage.setItem(AUTH_STORAGE_CONSTANTS.REFRESH_TOKEN, refreshToken);

    this.accessTokenSignal.set(accessToken);
    this.refreshTokenSignal.set(refreshToken);
  }

  clearTokens(): void {
    localStorage.removeItem(AUTH_STORAGE_CONSTANTS.ACCESS_TOKEN);
    localStorage.removeItem(AUTH_STORAGE_CONSTANTS.REFRESH_TOKEN);

    this.accessTokenSignal.set(null);
    this.refreshTokenSignal.set(null);
  }

  private getStoredAccessToken(): string | null {
    return localStorage.getItem(AUTH_STORAGE_CONSTANTS.ACCESS_TOKEN);
  }

  private getStoredRefreshToken(): string | null {
    return localStorage.getItem(AUTH_STORAGE_CONSTANTS.REFRESH_TOKEN);
  }

  private initStorageListener(): void {
    window.addEventListener('storage', this.storageListener);
  }

  private syncTokensFromStorage(): void {
    this.accessTokenSignal.set(this.getStoredAccessToken());
    this.refreshTokenSignal.set(this.getStoredRefreshToken());
  }
}
