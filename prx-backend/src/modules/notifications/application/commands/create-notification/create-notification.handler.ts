import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CreateNotificationCommand } from '@modules/notifications/application/commands/create-notification/create-notification.command';
import { NOTIFICATION_MESSAGES } from '@modules/notifications/application/constants/notification-messages.constants';
import { NotificationResponseMapper } from '@modules/notifications/application/mappers/notification-response.mapper';
import { NotificationEntity } from '@modules/notifications/domain/entities/notification.entity';
import { NotificationRepository } from '@modules/notifications/domain/repositories/notification.repository';

@CommandHandler(CreateNotificationCommand)
export class CreateNotificationHandler implements ICommandHandler<CreateNotificationCommand> {
  constructor(
    @Inject(NotificationRepository)
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async execute(command: CreateNotificationCommand) {
    const notificationEntity = new NotificationEntity(
      null,
      command.senderUserId,
      command.receiverUserId,
      command.title,
      command.type,
      command.referenceId,
      false,
      command.createdBy,
      command.message ?? null,
    );

    const notification =
      await this.notificationRepository.create(notificationEntity);

    return {
      message: NOTIFICATION_MESSAGES.CREATED,
      data: NotificationResponseMapper.toNotificationResponse(notification),
    };
  }
}
