import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { GetMeUnreadNotificationsCountQuery } from '@modules/notifications/application/queries/get-me-unread-notifications-count/get-me-unread-notifications-count.query';

import { NotificationRepository } from '@modules/notifications/domain/repositories/notification.repository';
import { UnreadNotificationsCountResponseMapper } from '@modules/notifications/application/mappers/unread-notifications-count-response.mapper';

@QueryHandler(GetMeUnreadNotificationsCountQuery)
export class GetMeUnreadNotificationsCountHandler implements IQueryHandler<GetMeUnreadNotificationsCountQuery> {
  constructor(
    @Inject(NotificationRepository)
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async execute(query: GetMeUnreadNotificationsCountQuery) {
    const count = await this.notificationRepository.countUnread(query.userId);

    return {
      data: UnreadNotificationsCountResponseMapper.toResponse(count),
    };
  }
}
