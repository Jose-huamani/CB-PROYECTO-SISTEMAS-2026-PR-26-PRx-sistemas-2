export class DeleteNotificationCommand {
  constructor(
    public readonly id: number,
    public readonly userId: number,
  ) {}
}
