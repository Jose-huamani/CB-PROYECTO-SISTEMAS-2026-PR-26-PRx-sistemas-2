import { UserResponseDto } from '@modules/users/application/dto/responses/user-response.dto';
import { NoteFileResponseDto } from './note-file-response.dto';

export class NoteTaskResponseDto {
    id!: string;
    title!: string;
    completed!: boolean;
}

export class NoteLinkResponseDto {
    id!: string;
    url!: string;
}

export class NoteResponseDto {
    id!: number;
    repositoryId!: number;
    title!: string;
    content!: string;
    tasks!: NoteTaskResponseDto[];
    links!: NoteLinkResponseDto[];
    files!: NoteFileResponseDto[];
    createdBy!: UserResponseDto;
    createdAt!: Date;
    updatedAt!: Date;
}
