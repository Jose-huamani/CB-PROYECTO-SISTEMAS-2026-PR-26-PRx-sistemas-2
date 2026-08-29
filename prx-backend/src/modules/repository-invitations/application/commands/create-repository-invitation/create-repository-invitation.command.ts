import { CreateRepositoryInvitationDto } from '@modules/repository-invitations/application/dto/requests/create-repository-invitation.dto';

export class CreateRepositoryInvitationCommand {
  constructor(
    public readonly repositoryId: number,
    public readonly dto: CreateRepositoryInvitationDto,
    public readonly senderUserId: number,
  ) {}
}
