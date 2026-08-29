import { NotificationModel } from '@features/notifications/domain/models/notifications.model';
import { GetMeNotificationsRequest } from '@features/notifications/domain/requests/get-me-notifications.request';
import { ApiResponseModel } from '@shared/models/api-response.model';
import { PaginatedResponseModel } from '@shared/models/paginated-response.model';
import { Observable } from 'rxjs';
import { UnreadNotificationsCountModel } from '@features/notifications/domain/models/unread-notifications-count.model';
import { MarkNotificationsAsReadRequest } from '@features/notifications/domain/requests/mark-notifications-as-read.request';

export abstract class NotificationsApiContract {
  abstract getMeNotifications(
    request: GetMeNotificationsRequest,
  ): Observable<ApiResponseModel<PaginatedResponseModel<NotificationModel>>>;

  abstract getUnreadCount(): Observable<ApiResponseModel<UnreadNotificationsCountModel>>;

  abstract markNotificationsAsRead(
    request: MarkNotificationsAsReadRequest,
  ): Observable<ApiResponseModel<void>>;

  abstract deleteById(id: number): Observable<ApiResponseModel<void>>;
}
