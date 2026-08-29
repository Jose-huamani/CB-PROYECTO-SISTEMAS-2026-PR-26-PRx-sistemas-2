import { NoteFileEntity } from '@modules/notes/domain/entities/note-file.entity';

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

export class NoteFilePrismaMapper {
    static toDomain(file: NoteFilePrismaModel): NoteFileEntity {
        return new NoteFileEntity(
            file.id,
            file.noteId,
            file.name,
            file.storagePath,
            file.createdBy,
            file.status,
            file.createdAt,
            file.updatedAt,
            file.updatedBy ?? undefined,
        );
    }

    static toDomainList(files: NoteFilePrismaModel[]): NoteFileEntity[] {
        return files.map((file) => this.toDomain(file));
    }
}
