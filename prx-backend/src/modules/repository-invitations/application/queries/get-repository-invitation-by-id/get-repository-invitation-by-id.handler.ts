import { ForbiddenException, Inject, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { REPOSITORY_INVITATION_MESSAGES } from '@modules/repository-invitations/application/constants/repository-invitation-messages.constants';
import { RepositoryInvitationResponseMapper } from '@modules/repository-invitations/application/mappers/repository-invitation-response.mapper';
import { RepositoryInvitationRepository } from '@modules/repository-invitations/domain/repositories/repository-invitation.repository';

import { GetRepositoryInvitationByIdQuery } from './get-repository-invitation-by-id.query';

@QueryHandler(GetRepositoryInvitationByIdQuery)
export class GetRepositoryInvitationByIdHandler implements IQueryHandler<GetRepositoryInvitationByIdQuery> {
  constructor(
    @Inject(RepositoryInvitationRepository)
    private readonly invitationRepository: RepositoryInvitationRepository,
  ) {}

  async execute(query: GetRepositoryInvitationByIdQuery) {
    const { id, userId } = query;

    const invitation = await this.invitationRepository.findById(id);

    if (!invitation) {
      throw new NotFoundException(REPOSITORY_INVITATION_MESSAGES.NOT_FOUND);
    }

    const isInvolved =
      invitation.invitedUserId === userId || invitation.senderUserId === userId;

    if (!isInvolved) {
      throw new ForbiddenException(
        REPOSITORY_INVITATION_MESSAGES.NOT_INVITED_USER,
      );
    }

    return {
      data: RepositoryInvitationResponseMapper.toRepositoryInvitationResponse(
        invitation,
      ),
    };
  }
}
