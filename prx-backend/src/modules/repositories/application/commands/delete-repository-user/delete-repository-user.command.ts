export class DeleteRepositoryUserCommand {
  constructor(
    public readonly repositoryId: number,
    public readonly targetUserId: number,
    public readonly requestUserId: number,
  ) {}
}
