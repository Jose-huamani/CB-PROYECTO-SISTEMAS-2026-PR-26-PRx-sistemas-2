import { UpdateNoteRequestDto } from '@modules/notes/application/dto/requests/update-note-request.dto';

export class UpdateNoteCommand {
    constructor(
        public readonly id: number,
        public readonly dto: UpdateNoteRequestDto,
        public readonly userId: number,
        public readonly files: Express.Multer.File[] = [],
    ) {}
}
