export class DeleteFileCommand {
  constructor(
    public readonly fileId: number,
    public readonly userId: number,
  ) {}
}
