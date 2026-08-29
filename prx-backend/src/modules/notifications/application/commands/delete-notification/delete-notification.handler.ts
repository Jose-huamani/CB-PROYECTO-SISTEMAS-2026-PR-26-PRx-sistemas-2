import { Inject, NotFoundException } from '@nestjs/common';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotificationType } from '@generated-prisma/enums';

import { DeleteNotificationCommand } from '@modules/notifications/application/commands/delete-notification/delete-notification.command';
import { NotificationRepository } from '@modules/notifications/domain/repositories/notification.repository';
import { NOTIFICATION_MESSAGES } from '@modules/notifications/application/constants/notification-messages.constants';

import { RejectRepositoryInvitationCommand } from '@modules/repository-invitations/application/commands/reject-repository-invitation/reject-repository-invitation.command';

@CommandHandler(DeleteNotificationCommand)
export class DeleteNotificationHandler implements ICommandHandler<DeleteNotificationCommand> {
  constructor(
    @Inject(NotificationRepository)
    private readonly notificationRepository: NotificationRepository,
    private readonly commandBus: CommandBus,
  ) {}

  async execute(command: DeleteNotificationCommand) {
    const { id, userId } = command;

    const notification = await this.notificationRepository.findById(id);

    if (!notification || notification.receiverUserId !== userId) {
      throw new NotFoundException(NOTIFICATION_MESSAGES.NOT_FOUND);
    }

    switch (notification.type) {
      case NotificationType.invitacion_repositorio:
        try {
          await this.commandBus.execute(
            new RejectRepositoryInvitationCommand(
              notification.referenceId,
              userId,
            ),
          );
        } catch {}
        break;

      default:
        break;
    }

    await this.notificationRepository.softDelete(id, userId, userId);

    return {
      message: NOTIFICATION_MESSAGES.DELETED,
    };
  }
}
