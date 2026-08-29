import {
  ConflictException,
  ForbiddenException,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InvitationStatus, NotificationType } from '@generated-prisma/enums';

import { RejectRepositoryInvitationCommand } from '@modules/repository-invitations/application/commands/reject-repository-invitation/reject-repository-invitation.command';
import { RepositoryInvitationRepository } from '@modules/repository-invitations/domain/repositories/repository-invitation.repository';
import { REPOSITORY_INVITATION_MESSAGES } from '@modules/repository-invitations/application/constants/repository-invitation-messages.constants';

import { DeleteNotificationsByReferenceCommand } from '@modules/notifications/application/commands/delete-notifications-by-reference/delete-notifications-by-reference.command';

@CommandHandler(RejectRepositoryInvitationCommand)
export class RejectRepositoryInvitationHandler implements ICommandHandler<RejectRepositoryInvitationCommand> {
  constructor(
    @Inject(RepositoryInvitationRepository)
    private readonly invitationRepository: RepositoryInvitationRepository,
    private readonly commandBus: CommandBus,
  ) {}

  async execute(command: RejectRepositoryInvitationCommand) {
    const { invitationId, userId } = command;

    const invitation = await this.invitationRepository.findById(invitationId);

    if (!invitation || invitation.status !== 1) {
      throw new NotFoundException(REPOSITORY_INVITATION_MESSAGES.NOT_FOUND);
    }

    if (invitation.invitationStatus !== InvitationStatus.pendiente) {
      throw new ConflictException(
        REPOSITORY_INVITATION_MESSAGES.ALREADY_PROCESSED,
      );
    }

    if (invitation.invitedUserId !== userId) {
      throw new ForbiddenException(
        REPOSITORY_INVITATION_MESSAGES.NOT_INVITED_USER,
      );
    }

    await this.invitationRepository.patch(invitationId, {
      invitationStatus: InvitationStatus.rechazada,
      updatedBy: userId,
    });

    await this.commandBus.execute(
      new DeleteNotificationsByReferenceCommand(
        NotificationType.invitacion_repositorio,
        invitationId,
        userId,
      ),
    );

    return {
      message: REPOSITORY_INVITATION_MESSAGES.REJECTED,
    };
  }
}
