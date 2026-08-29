export class GetFileDownloadUrlQuery {
  constructor(
    public readonly fileId: number,
    public readonly userId: number,
  ) {}
}
