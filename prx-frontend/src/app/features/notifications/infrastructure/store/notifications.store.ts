import { Injectable, computed, signal } from '@angular/core';

import { NotificationModel } from '@features/notifications/domain/models/notifications.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationsStore {
  private readonly itemsSignal = signal<NotificationModel[]>([]);
  private readonly totalSignal = signal(0);
  private readonly pageSignal = signal(1);
  private readonly limitSignal = signal(10);
  private readonly loadingSignal = signal(false);
  private readonly actionLoadingSignal = signal(false);
  private readonly unreadCountSignal = signal(0);

  readonly items = computed(() => this.itemsSignal());
  readonly total = computed(() => this.totalSignal());
  readonly page = computed(() => this.pageSignal());
  readonly limit = computed(() => this.limitSignal());
  readonly loading = computed(() => this.loadingSignal());
  readonly actionLoading = computed(() => this.actionLoadingSignal());
  readonly unreadCount = computed(() => this.unreadCountSignal());

  setItems(items: NotificationModel[]): void {
    this.itemsSignal.set(items);
  }

  setTotal(total: number): void {
    this.totalSignal.set(total);
  }

  setPage(page: number): void {
    this.pageSignal.set(page);
  }

  setLimit(limit: number): void {
    this.limitSignal.set(limit);
  }

  setLoading(loading: boolean): void {
    this.loadingSignal.set(loading);
  }

  setActionLoading(actionLoading: boolean): void {
    this.actionLoadingSignal.set(actionLoading);
  }

  setUnreadCount(count: number): void {
    this.unreadCountSignal.set(count);
  }

  markAsReadLocal(ids: number[]): void {
    const idSet = new Set(ids);

    this.itemsSignal.update((items) =>
      items.map((item) => (idSet.has(item.id) ? { ...item, isRead: true } : item)),
    );
  }

  removeNotification(id: number): void {
    this.itemsSignal.update((items) => items.filter((n) => n.id !== id));
    this.totalSignal.update((t) => (t > 0 ? t - 1 : 0));
  }

  clear(): void {
    this.itemsSignal.set([]);
    this.totalSignal.set(0);
    this.pageSignal.set(1);
    this.limitSignal.set(10);
    this.loadingSignal.set(false);
    this.actionLoadingSignal.set(false);
    this.unreadCountSignal.set(0);
  }
}
