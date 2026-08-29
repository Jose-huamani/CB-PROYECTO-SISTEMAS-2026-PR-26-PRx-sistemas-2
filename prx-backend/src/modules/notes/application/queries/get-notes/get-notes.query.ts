import { GetNotesRequestDto } from '@modules/notes/application/dto/requests/get-notes-request.dto';

export class GetNotesQuery {
    constructor(
        public readonly repositoryId: number,
        public readonly userId: number,
        public readonly query: GetNotesRequestDto,
    ) { }
}
