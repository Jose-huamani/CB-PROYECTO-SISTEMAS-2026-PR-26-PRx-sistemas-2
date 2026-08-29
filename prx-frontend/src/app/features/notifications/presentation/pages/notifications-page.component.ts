import { Component, OnInit, inject } from '@angular/core';
import { switchMap, of } from 'rxjs';
import { NotificationListComponent } from '@features/notifications/presentation/components/notification-list/notification-list.component';
import { NotificationsFacade } from '@features/notifications/application/facades/notifications.facade';

@Component({
  selector: 'app-notifications-page',
  standalone: true,
  imports: [NotificationListComponent],
  templateUrl: './notifications-page.component.html',
  styleUrl: './notifications-page.component.scss',
})
export class NotificationsPageComponent implements OnInit {
  private readonly notificationsFacade = inject(NotificationsFacade);

  ngOnInit(): void {
    this.notificationsFacade
      .loadNotifications(this.notificationsFacade.page(), this.notificationsFacade.limit(), true)
      .pipe(switchMap(() => this.notificationsFacade.markAllAsRead()))
      .subscribe();
  }
}
