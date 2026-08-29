import { CreateNoteRequestDto } from '@modules/notes/application/dto/requests/create-note-request.dto';

export class CreateNoteCommand {
    constructor(
        public readonly repositoryId: number,
        public readonly dto: CreateNoteRequestDto,
        public readonly createdBy: number,
        public readonly files?: Express.Multer.File[],
    ) { }
}
