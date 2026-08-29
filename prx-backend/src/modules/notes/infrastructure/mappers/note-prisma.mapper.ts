import { Role } from '@generated-prisma/enums';
import { NoteEntity } from '@modules/notes/domain/entities/note.entity';
import { NoteFilePrismaMapper } from '@modules/notes/infrastructure/mappers/note-file-prisma.mapper';
import { UserPrismaMapper } from '@modules/users/infrastructure/mappers/user-prisma.mapper';

type NoteFilePrismaModel = {
    id: number;
    noteId: number;
    name: string;
    storagePath: string;
    status: number;
    createdAt: Date;
    updatedAt: Date;
    createdBy: number;
    updatedBy?: number | null;
};

type NotePrismaModel = {
    id: number;
    repositoryId: number;
    title: string;
    content: string;
    status: number;
    createdAt: Date;
    updatedAt: Date;
    createdBy: number;
    updatedBy?: number | null;
    noteFiles?: NoteFilePrismaModel[];
    createdByUser?: {
        id: number;
        username: string;
        email: string;
        password: string;
        role: Role;
        avatarUrl: string;
        status: number;
        createdAt: Date;
        updatedAt: Date;
        createdBy: number;
        updatedBy?: number | null;
    } | null;
};

export class NotePrismaMapper {
    static toDomain(note: NotePrismaModel): NoteEntity {
        const files = (note.noteFiles ?? []).map((file) => NoteFilePrismaMapper.toDomain(file));
        const createdByUser = note.createdByUser ? UserPrismaMapper.toDomain(note.createdByUser) : undefined;

        return new NoteEntity(
            note.id,
            note.repositoryId,
            note.title,
            note.content,
            note.createdBy,
            files,
            note.status,
            note.createdAt,
            note.updatedAt,
            note.updatedBy ?? undefined,
            createdByUser,
        );
    }

    static toDomainList(notes: NotePrismaModel[]): NoteEntity[] {
        return notes.map((note) => this.toDomain(note));
    }
}
