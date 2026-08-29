import { Injectable, inject } from '@angular/core';
import { Observable, catchError, finalize, of, tap, throwError } from 'rxjs';

import { NotificationsApi } from '@features/notifications/infrastructure/api/notifications.api';
import { NotificationsStore } from '@features/notifications/infrastructure/store/notifications.store';
import { NotificationModel } from '@features/notifications/domain/models/notifications.model';
import { UnreadNotificationsCountModel } from '@features/notifications/domain/models/unread-notifications-count.model';
import { ApiResponseModel } from '@shared/models/api-response.model';
import { PaginatedResponseModel } from '@shared/models/paginated-response.model';
import { resolvePublicStorageUrl } from '@shared/utils/storage-url.util';

@Injectable({
  providedIn: 'root',
})
export class NotificationsFacade {
  private readonly api = inject(NotificationsApi);
  private readonly store = inject(NotificationsStore);

  readonly notifications = this.store.items;
  readonly total = this.store.total;
  readonly page = this.store.page;
  readonly limit = this.store.limit;
  readonly loading = this.store.loading;
  readonly actionLoading = this.store.actionLoading;
  readonly unreadCount = this.store.unreadCount;
  readonly pendingCount = this.store.unreadCount;

  loadNotifications(
    page: number,
    limit: number,
    isBackground = false,
  ): Observable<ApiResponseModel<PaginatedResponseModel<NotificationModel>>> {
    this.store.setPage(page);
    this.store.setLimit(limit);

    if (!isBackground) {
      this.store.setLoading(true);
    }

    return this.api.getMeNotifications({ page, limit }).pipe(
      tap((response) => {
        if (response.data) {
          this.store.setItems(this.mapNotifications(response.data.items));
          this.store.setTotal(response.data.total);
        }
      }),
      finalize(() => {
        if (!isBackground) {
          this.store.setLoading(false);
        }
      }),
    );
  }

  loadUnreadCount(): Observable<ApiResponseModel<UnreadNotificationsCountModel>> {
    return this.api.getUnreadCount().pipe(
      tap((response) => {
        this.store.setUnreadCount(response.data?.count ?? 0);
      }),
    );
  }

  markNotificationsAsRead(notificationIds: number[]): Observable<ApiResponseModel<void>> {
    const unreadIds = this.store
      .items()
      .filter((n) => notificationIds.includes(n.id) && !n.isRead)
      .map((n) => n.id);

    if (unreadIds.length === 0) {
      return of(undefined as unknown as ApiResponseModel<void>);
    }

    const backup = this.store.items();

    this.store.markAsReadLocal(unreadIds);
    this.store.setUnreadCount(Math.max(this.store.unreadCount() - unreadIds.length, 0));

    return this.api.markNotificationsAsRead({ notificationIds: unreadIds }).pipe(
      catchError((error) => {
        this.store.setItems(backup);
        return throwError(() => error);
      }),
    );
  }

  deleteNotification(id: number): Observable<ApiResponseModel<void>> {
    const target = this.store.items().find((n) => n.id === id);
    this.store.setActionLoading(true);

    return this.api.deleteById(id).pipe(
      tap(() => {
        this.store.removeNotification(id);

        if (target && !target.isRead) {
          this.store.setUnreadCount(Math.max(this.store.unreadCount() - 1, 0));
        }
      }),
      finalize(() => {
        this.store.setActionLoading(false);
      }),
    );
  }

  removeNotificationLocal(id: number): void {
    const target = this.store.items().find((n) => n.id === id);
    this.store.removeNotification(id);

    if (target && !target.isRead) {
      this.store.setUnreadCount(Math.max(this.store.unreadCount() - 1, 0));
    }
  }

  clearState(): void {
    this.store.clear();
  }

  private mapNotifications(items: NotificationModel[]): NotificationModel[] {
    return items.map((notification) => this.mapNotification(notification));
  }

  private mapNotification(notification: NotificationModel): NotificationModel {
    return {
      ...notification,
      senderUser: {
        ...notification.senderUser,
        avatarUrl: resolvePublicStorageUrl(notification.senderUser.avatarUrl),
      },
    };
  }

  markAllAsRead(): Observable<ApiResponseModel<void>> {
    const unreadIds = this.store
      .items()
      .filter((n) => !n.isRead)
      .map((n) => n.id);

    if (unreadIds.length === 0) {
      return of(undefined as unknown as ApiResponseModel<void>);
    }

    return this.markNotificationsAsRead(unreadIds);
  }
}
