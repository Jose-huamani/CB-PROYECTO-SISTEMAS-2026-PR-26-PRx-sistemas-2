import {
  BadRequestException,
  ConflictException,
  Inject,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotificationType, InvitationStatus } from '@generated-prisma/enums';

import { CreateRepositoryInvitationCommand } from '@modules/repository-invitations/application/commands/create-repository-invitation/create-repository-invitation.command';
import { RepositoryInvitationRepository } from '@modules/repository-invitations/domain/repositories/repository-invitation.repository';
import { RepositoryInvitationEntity } from '@modules/repository-invitations/domain/entities/repository-invitation.entity';
import { RepositoryInvitationResponseMapper } from '@modules/repository-invitations/application/mappers/repository-invitation-response.mapper';

import { UserRepository } from '@modules/users/domain/repositories/user.repository';

import { RepositoryUserRepository } from '@modules/repositories/domain/repositories/repository-user.repository';
import { RepositoryRoleRepository } from '@modules/repositories/domain/repositories/repository-role.repository';
import { REPOSITORY_MESSAGES } from '@modules/repositories/application/constants/repository-messages.constants';
import { REPOSITORY_ROLE_MESSAGES } from '@modules/repositories/application/constants/repository-role-messages.constants';

import { CreateNotificationCommand } from '@modules/notifications/application/commands/create-notification/create-notification.command';
import { NOTIFICATION_MESSAGES } from '@modules/notifications/application/constants/notification-messages.constants';

import { USER_MESSAGES } from '@modules/users/application/constants/user-messages.constants';

const COCREADOR_ROLE_NAME = 'cocreador';

@CommandHandler(CreateRepositoryInvitationCommand)
export class CreateRepositoryInvitationHandler implements ICommandHandler<CreateRepositoryInvitationCommand> {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
    @Inject(RepositoryUserRepository)
    private readonly repositoryUserRepository: RepositoryUserRepository,
    @Inject(RepositoryInvitationRepository)
    private readonly invitationRepository: RepositoryInvitationRepository,
    @Inject(RepositoryRoleRepository)
    private readonly repositoryRoleRepository: RepositoryRoleRepository,
    private readonly commandBus: CommandBus,
  ) {}

  async execute(command: CreateRepositoryInvitationCommand) {
    const { repositoryId, dto, senderUserId } = command;

    const invitedUser = await this.userRepository.findByEmail(
      dto.invitedUserEmail,
    );
    if (!invitedUser) {
      throw new NotFoundException(USER_MESSAGES.NOT_FOUND_BY_EMAIL);
    }

    const invitedUserId = invitedUser.id as number;

    if (senderUserId === invitedUserId) {
      throw new BadRequestException(REPOSITORY_MESSAGES.CANNOT_INVITE_SELF);
    }

    const existingMember =
      await this.repositoryUserRepository.findByRepositoryIdAndUserId(
        repositoryId,
        invitedUserId,
      );
    if (existingMember) {
      throw new ConflictException(REPOSITORY_MESSAGES.USER_ALREADY_MEMBER);
    }

    const existingInvitation =
      await this.invitationRepository.findByRepositoryIdAndUserId(
        repositoryId,
        invitedUserId,
      );
    if (existingInvitation) {
      throw new ConflictException(
        REPOSITORY_MESSAGES.PENDING_INVITATION_EXISTS,
      );
    }

    const cocreadorRole =
      await this.repositoryRoleRepository.findByName(COCREADOR_ROLE_NAME);
    if (!cocreadorRole) {
      throw new InternalServerErrorException(
        REPOSITORY_ROLE_MESSAGES.COCREADOR_NOT_FOUND,
      );
    }

    const invitationEntity = new RepositoryInvitationEntity(
      null,
      repositoryId,
      senderUserId,
      invitedUserId,
      cocreadorRole.id as number,
      dto.repositoryFunctionId,
      InvitationStatus.pendiente,
      dto.welcomeMessage ?? null,
      senderUserId,
    );

    const createdInvitation =
      await this.invitationRepository.create(invitationEntity);

    await this.commandBus.execute(
      new CreateNotificationCommand(
        senderUserId,
        invitedUserId,
        NOTIFICATION_MESSAGES.INVITATION_TITLE,
        NotificationType.invitacion_repositorio,
        createdInvitation.id as number,
        senderUserId,
        dto.welcomeMessage ?? null,
      ),
    );

    return {
      message: REPOSITORY_MESSAGES.INVITATION_CREATED,
      data: RepositoryInvitationResponseMapper.toRepositoryInvitationResponse(
        createdInvitation,
      ),
    };
  }
}
