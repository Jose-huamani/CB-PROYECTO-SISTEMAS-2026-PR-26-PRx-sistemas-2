import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseFeatureApi } from '@core/api/base-feature.api';
import { NotificationsApiContract } from '@features/notifications/domain/contracts/notifications-api.contracts';
import { NOTIFICATIONS_API_CONFIG } from '@features/notifications/infrastructure/config/notifications-api.config';
import { NotificationModel } from '@features/notifications/domain/models/notifications.model';
import { UnreadNotificationsCountModel } from '@features/notifications/domain/models/unread-notifications-count.model';
import { GetMeNotificationsRequest } from '@features/notifications/domain/requests/get-me-notifications.request';
import { MarkNotificationsAsReadRequest } from '@features/notifications/domain/requests/mark-notifications-as-read.request';
import { ApiResponseModel } from '@shared/models/api-response.model';
import { PaginatedResponseModel } from '@shared/models/paginated-response.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationsApi extends BaseFeatureApi implements NotificationsApiContract {
  constructor(http: HttpClient) {
    super(http, NOTIFICATIONS_API_CONFIG.base);
  }

  getMeNotifications(
    data: GetMeNotificationsRequest,
  ): Observable<ApiResponseModel<PaginatedResponseModel<NotificationModel>>> {
    return this.get<PaginatedResponseModel<NotificationModel>>(
      this.buildUrl(NOTIFICATIONS_API_CONFIG.endpoints.me),
      { page: data.page, limit: data.limit },
    );
  }

  getUnreadCount(): Observable<ApiResponseModel<UnreadNotificationsCountModel>> {
    return this.get<UnreadNotificationsCountModel>(
      this.buildUrl(NOTIFICATIONS_API_CONFIG.endpoints.unreadCount),
    );
  }

  markNotificationsAsRead(
    request: MarkNotificationsAsReadRequest,
  ): Observable<ApiResponseModel<void>> {
    return this.patch<void>(this.buildUrl(NOTIFICATIONS_API_CONFIG.endpoints.read), request);
  }

  deleteById(id: number): Observable<ApiResponseModel<void>> {
    return this.delete<void>(
      this.buildUrl(NOTIFICATIONS_API_CONFIG.endpoints.byId.replace(':id', id.toString())),
    );
  }
}
