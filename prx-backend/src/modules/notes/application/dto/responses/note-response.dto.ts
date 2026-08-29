import { UserResponseDto } from '@modules/users/application/dto/responses/user-response.dto';
import { NoteFileResponseDto } from './note-file-response.dto';

export class NoteResponseDto {
    id!: number;
    repositoryId!: number;
    title!: string;
    content!: string;
    files!: NoteFileResponseDto[];
    createdBy!: UserResponseDto;
    createdAt!: Date;
    updatedAt!: Date;
}
