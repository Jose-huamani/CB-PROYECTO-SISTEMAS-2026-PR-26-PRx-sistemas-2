export class AcceptRepositoryInvitationCommand {
  constructor(
    public readonly invitationId: number,
    public readonly userId: number,
  ) {}
}