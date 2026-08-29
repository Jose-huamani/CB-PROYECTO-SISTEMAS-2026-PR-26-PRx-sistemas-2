export class RejectRepositoryInvitationCommand {
  constructor(
    public readonly invitationId: number,
    public readonly userId: number,
  ) {}
}