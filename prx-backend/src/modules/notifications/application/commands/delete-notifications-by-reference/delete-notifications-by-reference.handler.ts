import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { DeleteNotificationsByReferenceCommand } from '@modules/notifications/application/commands/delete-notifications-by-reference/delete-notifications-by-reference.command';
import { NotificationRepository } from '@modules/notifications/domain/repositories/notification.repository';
import { NOTIFICATION_MESSAGES } from '@modules/notifications/application/constants/notification-messages.constants';

@CommandHandler(DeleteNotificationsByReferenceCommand)
export class DeleteNotificationsByReferenceHandler implements ICommandHandler<DeleteNotificationsByReferenceCommand> {
  constructor(
    @Inject(NotificationRepository)
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async execute(command: DeleteNotificationsByReferenceCommand) {
    const { type, referenceId, updatedBy } = command;

    await this.notificationRepository.softDeleteByReference(
      type,
      referenceId,
      updatedBy,
    );

    return {
      message: NOTIFICATION_MESSAGES.DELETED,
    };
  }
}
