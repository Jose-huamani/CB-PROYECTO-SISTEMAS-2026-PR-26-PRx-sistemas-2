import { NoteResponseDto } from '@modules/notes/application/dto/responses/note-response.dto';
import { NoteEntity } from '@modules/notes/domain/entities/note.entity';
import { UserResponseMapper } from '@modules/users/application/mappers/user-response.mapper';
import { PaginatedResponseDto } from '@shared/application/dto/paginated-response.dto';
import { NoteFileResponseMapper } from '@modules/notes/application/mappers/note-file-response.mapper';

export class NoteResponseMapper {
    static toNoteResponse(note: NoteEntity): NoteResponseDto {
        return {
            id: note.id as number,
            repositoryId: note.repositoryId,
            title: note.title,
            content: note.content,
            files: NoteFileResponseMapper.toNoteFileResponseList(note.files ?? []),
            createdBy: UserResponseMapper.toUserResponse(note.createdByUser!),
            createdAt: note.createdAt as Date,
            updatedAt: note.updatedAt as Date,
        };
    }

    static toPaginatedResponse(
        paginated: PaginatedResponseDto<NoteEntity>,
    ): PaginatedResponseDto<NoteResponseDto> {
        return {
            items: paginated.items.map((item) => this.toNoteResponse(item)),
            total: paginated.total,
            page: paginated.page,
            limit: paginated.limit,
        };
    }
}
