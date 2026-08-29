export class DeleteBinnacleCommand {
  constructor(
    public readonly id: number,
    public readonly userId: number,
  ) {}
}
