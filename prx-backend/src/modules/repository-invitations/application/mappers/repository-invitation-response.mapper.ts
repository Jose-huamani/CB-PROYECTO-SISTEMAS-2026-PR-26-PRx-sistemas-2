import { RepositoryInvitationResponseDto } from '@modules/repository-invitations/application/dto/responses/repository-invitation-response.dto';
import { RepositoryInvitationEntity } from '@modules/repository-invitations/domain/entities/repository-invitation.entity';

export class RepositoryInvitationResponseMapper {
  static toRepositoryInvitationResponse(
    entity: RepositoryInvitationEntity,
  ): RepositoryInvitationResponseDto {
    return {
      id: entity.id as number,
      repositoryId: entity.repositoryId,
      repositoryName: entity.repository?.name,
      senderUserId: entity.senderUserId,
      senderName: entity.senderUser?.username,
      senderLastName: undefined,
      invitedUserId: entity.invitedUserId,
      repositoryRoleId: entity.repositoryRoleId,
      repositoryFunctionId: entity.repositoryFunctionId,
      roleName: entity.repositoryRole?.name,
      invitationStatus: entity.invitationStatus,
      welcomeMessage: entity.welcomeMessage,
      createdAt: entity.createdAt as Date,
    };
  }
}
