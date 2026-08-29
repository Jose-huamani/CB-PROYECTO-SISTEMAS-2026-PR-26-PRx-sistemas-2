import { RepositoryInvitationEntity } from '@modules/repository-invitations/domain/entities/repository-invitation.entity';

export abstract class RepositoryInvitationRepository {
  abstract findById(id: number): Promise<RepositoryInvitationEntity | null>;

  abstract patch(
    id: number,
    data: Partial<RepositoryInvitationEntity>,
  ): Promise<RepositoryInvitationEntity>;

  abstract findManyByStatus(
    status: string,
  ): Promise<RepositoryInvitationEntity[]>;

  abstract create(
    entity: RepositoryInvitationEntity,
  ): Promise<RepositoryInvitationEntity>;

  abstract findByRepositoryIdAndUserId(
    repositoryId: number,
    userId: number,
  ): Promise<RepositoryInvitationEntity | null>;
}
