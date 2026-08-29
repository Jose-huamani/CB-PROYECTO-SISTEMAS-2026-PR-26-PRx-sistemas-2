import { NoteFileResponseDto } from '@modules/notes/application/dto/responses/note-file-response.dto';
import { NoteFileEntity } from '@modules/notes/domain/entities/note-file.entity';

export class NoteFileResponseMapper {
    static toNoteFileResponse(file: NoteFileEntity): NoteFileResponseDto {
        return {
            id: file.id as number,
            noteId: file.noteId,
            name: file.name,
            storagePath: file.storagePath,
            createdAt: file.createdAt as Date,
            updatedAt: file.updatedAt as Date,
        };
    }

    static toNoteFileResponseList(files: NoteFileEntity[]): NoteFileResponseDto[] {
        return files.map((f) => this.toNoteFileResponse(f));
    }
}
