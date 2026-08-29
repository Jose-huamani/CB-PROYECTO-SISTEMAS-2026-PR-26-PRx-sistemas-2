export class DeleteFolderCommand {
  constructor(
    public readonly folderId: number,
    public readonly userId: number,
  ) {}
}
