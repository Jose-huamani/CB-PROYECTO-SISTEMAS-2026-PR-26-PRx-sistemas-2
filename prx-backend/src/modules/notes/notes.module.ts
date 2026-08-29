import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { NotesController } from '@modules/notes/presentation/controllers/notes.controller';
import { RepositoriesModule } from '@modules/repositories/repositories.module';

import { NoteRepository } from '@modules/notes/domain/repositories/note.repository';
import { NoteFileRepository } from '@modules/notes/domain/repositories/note-file.repository';
import { PrismaNoteRepository } from '@modules/notes/infrastructure/persistence/prisma-note.repository';
import { PrismaNoteFileRepository } from '@modules/notes/infrastructure/persistence/prisma-note-file.repository';

import { CreateNoteHandler } from '@modules/notes/application/commands/create-note/create-note.handler';
import { DeleteNoteHandler } from '@modules/notes/application/commands/delete-note/delete-note.handler';
import { GetNotesHandler } from '@modules/notes/application/queries/get-notes/get-notes.handler';
import { GetNoteByIdHandler } from '@modules/notes/application/queries/get-note-by-id/get-note-by-id.handler';
import { GetNoteFileDownloadUrlHandler } from '@modules/notes/application/queries/get-note-file-download-url/get-note-file-download-url.handler';

@Module({
    imports: [CqrsModule, RepositoriesModule],
    controllers: [NotesController],
    providers: [
        CreateNoteHandler,
        DeleteNoteHandler,
        GetNotesHandler,
        GetNoteByIdHandler,
        GetNoteFileDownloadUrlHandler,
        {
            provide: NoteRepository,
            useClass: PrismaNoteRepository,
        },
        {
            provide: NoteFileRepository,
            useClass: PrismaNoteFileRepository,
        },
    ],
    exports: [NoteRepository, NoteFileRepository],
})
export class NotesModule { }
