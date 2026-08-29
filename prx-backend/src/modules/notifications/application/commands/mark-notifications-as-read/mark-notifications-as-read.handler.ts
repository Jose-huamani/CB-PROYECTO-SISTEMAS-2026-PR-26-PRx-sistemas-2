import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { MarkNotificationsAsReadCommand } from '@modules/notifications/application/commands/mark-notifications-as-read/mark-notifications-as-read.command';
import { NotificationRepository } from '@modules/notifications/domain/repositories/notification.repository';
import { NOTIFICATION_MESSAGES } from '@modules/notifications/application/constants/notification-messages.constants';

@CommandHandler(MarkNotificationsAsReadCommand)
export class MarkNotificationsAsReadHandler implements ICommandHandler<MarkNotificationsAsReadCommand> {
  constructor(
    @Inject(NotificationRepository)
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async execute(command: MarkNotificationsAsReadCommand) {
    const { notificationIds } = command.dto;
    const { userId } = command;

    await this.notificationRepository.markManyAsRead(
      notificationIds,
      userId,
      userId,
    );

    return {
      message: NOTIFICATION_MESSAGES.MARKED_AS_READ,
    };
  }
}
