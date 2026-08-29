import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { GetMeNotificationsQuery } from '@modules/notifications/application/queries/get-me-notifications/get-me-notifications.query';

import { NotificationRepository } from '@modules/notifications/domain/repositories/notification.repository';
import { NotificationResponseMapper } from '@modules/notifications/application/mappers/notification-response.mapper';

@QueryHandler(GetMeNotificationsQuery)
export class GetMeNotificationsHandler implements IQueryHandler<GetMeNotificationsQuery> {
  constructor(
    @Inject(NotificationRepository)
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async execute(query: GetMeNotificationsQuery) {
    const { dto, userId } = query;

    const notifications = await this.notificationRepository.findMe(
      userId,
      dto.page,
      dto.limit,
    );

    return {
      data: NotificationResponseMapper.toPaginatedResponse(
        notifications,
      ),
    };
  }
}
