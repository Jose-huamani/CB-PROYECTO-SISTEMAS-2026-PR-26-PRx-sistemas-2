import {
  ConflictException,
  ForbiddenException,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InvitationStatus, NotificationType } from '@generated-prisma/enums';

import { AcceptRepositoryInvitationCommand } from '@modules/repository-invitations/application/commands/accept-repository-invitation/accept-repository-invitation.command';
import { RepositoryInvitationRepository } from '@modules/repository-invitations/domain/repositories/repository-invitation.repository';
import { REPOSITORY_INVITATION_MESSAGES } from '@modules/repository-invitations/application/constants/repository-invitation-messages.constants';

import { RepositoryUserRepository } from '@modules/repositories/domain/repositories/repository-user.repository';
import { REPOSITORY_MESSAGES } from '@modules/repositories/application/constants/repository-messages.constants';

import { DeleteNotificationsByReferenceCommand } from '@modules/notifications/application/commands/delete-notifications-by-reference/delete-notifications-by-reference.command';

@CommandHandler(AcceptRepositoryInvitationCommand)
export class AcceptRepositoryInvitationHandler implements ICommandHandler<AcceptRepositoryInvitationCommand> {
  constructor(
    @Inject(RepositoryInvitationRepository)
    private readonly invitationRepository: RepositoryInvitationRepository,
    @Inject(RepositoryUserRepository)
    private readonly repositoryUserRepository: RepositoryUserRepository,
    private readonly commandBus: CommandBus,
  ) {}

  async execute(command: AcceptRepositoryInvitationCommand) {
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

    const activeMember =
      await this.repositoryUserRepository.findByRepositoryIdAndUserId(
        invitation.repositoryId,
        invitation.invitedUserId,
      );
    if (activeMember) {
      throw new ConflictException(REPOSITORY_MESSAGES.USER_ALREADY_MEMBER);
    }

    const previousMember =
      await this.repositoryUserRepository.findByRepositoryIdAndUserIdIgnoreStatus(
        invitation.repositoryId,
        invitation.invitedUserId,
      );

    if (previousMember) {
      await this.repositoryUserRepository.reactivate(
        previousMember.id as number,
        {
          repositoryRoleId: invitation.repositoryRoleId,
          repositoryFunctionId: invitation.repositoryFunctionId,
          updatedBy: userId,
        },
      );
    } else {
      await this.repositoryUserRepository.create({
        repositoryId: invitation.repositoryId,
        userId: invitation.invitedUserId,
        repositoryRoleId: invitation.repositoryRoleId,
        repositoryFunctionId: invitation.repositoryFunctionId,
        createdBy: userId,
      });
    }

    await this.invitationRepository.patch(invitationId, {
      invitationStatus: InvitationStatus.aceptada,
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
      message: REPOSITORY_INVITATION_MESSAGES.ACCEPTED,
    };
  }
}
