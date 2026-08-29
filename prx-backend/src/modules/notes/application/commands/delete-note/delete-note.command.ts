export class DeleteNoteCommand {
    constructor(
        public readonly id: number,
        public readonly userId: number,
    ) { }
}
