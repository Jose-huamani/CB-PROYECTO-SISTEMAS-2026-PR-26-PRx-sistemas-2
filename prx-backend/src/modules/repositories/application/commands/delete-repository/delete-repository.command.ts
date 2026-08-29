export class DeleteRepositoryCommand {
  constructor(
    public readonly id: number,
    public readonly userId: number,
  ) {}
}
