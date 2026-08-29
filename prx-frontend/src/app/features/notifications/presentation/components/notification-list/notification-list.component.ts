import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { of, switchMap } from 'rxjs';

import { NotificationsFacade } from '@features/notifications/application/facades/notifications.facade';
import { NotificationItemComponent } from '@features/notifications/presentation/components/notification-item/notification-item.component';
import { AppPaginationComponent } from '@shared/ui/components/app-pagination/app-pagination.component';

@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [CommonModule, PaginatorModule, NotificationItemComponent, AppPaginationComponent],
  templateUrl: './notification-list.component.html',
  styleUrl: './notification-list.component.scss',
})
export class NotificationListComponent implements OnInit {
  private readonly notificationsFacade = inject(NotificationsFacade);
  private readonly router = inject(Router);

  protected readonly notifications = this.notificationsFacade.notifications;
  protected readonly loading = this.notificationsFacade.loading;
  protected readonly total = this.notificationsFacade.total;
  protected readonly page = this.notificationsFacade.page;
  protected readonly limit = this.notificationsFacade.limit;

  ngOnInit(): void {
    this.load(this.page(), this.limit());
  }

  protected onPageChange(event: PaginatorState): void {
    const page = (event.page ?? 0) + 1;
    const limit = event.rows ?? this.limit();
    this.load(page, limit);
  }

  protected onDeleted(id: number): void {
    this.notificationsFacade.removeNotificationLocal(id);
    this.notificationsFacade.loadUnreadCount().subscribe();
  }

  protected onInvitationResolved(event: {
    notificationId: number;
    accepted: boolean;
    repositoryId?: number;
  }): void {
    this.notificationsFacade.removeNotificationLocal(event.notificationId);
    this.notificationsFacade.loadUnreadCount().subscribe();
    if (event.accepted && event.repositoryId) {
      void this.router.navigate(['/repositories', event.repositoryId]);
    }
  }

  private load(page: number, limit: number): void {
    this.notificationsFacade
      .loadNotifications(page, limit)
      .pipe(
        switchMap(() => {
          const ids = this.notifications().map((n) => n.id);
          return ids.length > 0 ? this.notificationsFacade.markNotificationsAsRead(ids) : of(null);
        }),
        switchMap(() => this.notificationsFacade.loadUnreadCount()),
      )
      .subscribe();
  }
}
