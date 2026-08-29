export class GetNoteFileDownloadUrlQuery {
    constructor(
        public readonly fileId: number,
        public readonly userId: number,
    ) { }
}
