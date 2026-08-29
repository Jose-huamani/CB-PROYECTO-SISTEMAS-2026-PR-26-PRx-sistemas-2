export class GetNoteByIdQuery {
    constructor(
        public readonly id: number,
        public readonly userId: number,
    ) { }
}
