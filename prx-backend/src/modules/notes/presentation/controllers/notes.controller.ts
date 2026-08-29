import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Post,
    Query,
    UploadedFiles,
    UseInterceptors,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';

import { CreateNoteCommand } from '@modules/notes/application/commands/create-note/create-note.command';
import { DeleteNoteCommand } from '@modules/notes/application/commands/delete-note/delete-note.command';
import { CreateNoteRequestDto } from '@modules/notes/application/dto/requests/create-note-request.dto';
import { GetNotesRequestDto } from '@modules/notes/application/dto/requests/get-notes-request.dto';
import { GetNotesQuery } from '@modules/notes/application/queries/get-notes/get-notes.query';
import { GetNoteByIdQuery } from '@modules/notes/application/queries/get-note-by-id/get-note-by-id.query';
import { GetNoteFileDownloadUrlQuery } from '@modules/notes/application/queries/get-note-file-download-url/get-note-file-download-url.query';
import { CurrentUser } from '@shared/presentation/decorators/current-user.decorator';
import { NoteFilesUploadPipe } from '@modules/notes/presentation/pipes/note-files-upload.pipe';

@ApiTags('Notes')
@ApiBearerAuth()
@Controller('notes')
export class NotesController {
    constructor(
        private readonly queryBus: QueryBus,
        private readonly commandBus: CommandBus,
    ) { }

    @Get('repository/:repositoryId')
    @HttpCode(HttpStatus.OK)
    findNotes(
        @Param('repositoryId', ParseIntPipe) repositoryId: number,
        @Query() query: GetNotesRequestDto,
        @CurrentUser('sub') userId: number,
    ) {
        return this.queryBus.execute(
            new GetNotesQuery(repositoryId, userId, query),
        );
    }

    @Get('files/:id/download')
    @HttpCode(HttpStatus.OK)
    downloadFile(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser('sub') userId: number,
    ) {
        return this.queryBus.execute(new GetNoteFileDownloadUrlQuery(id, userId));
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    findNoteById(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser('sub') userId: number,
    ) {
        return this.queryBus.execute(new GetNoteByIdQuery(id, userId));
    }

    @Post('repository/:repositoryId')
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: CreateNoteRequestDto })
    @UseInterceptors(FilesInterceptor('files', 5))
    @HttpCode(HttpStatus.CREATED)
    createNote(
        @Param('repositoryId', ParseIntPipe) repositoryId: number,
        @Body() createNoteRequestDto: CreateNoteRequestDto,
        @UploadedFiles(NoteFilesUploadPipe) files: Express.Multer.File[],
        @CurrentUser('sub') userId: number,
    ) {
        return this.commandBus.execute(
            new CreateNoteCommand(repositoryId, createNoteRequestDto, userId, files),
        );
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    deleteNote(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser('sub') userId: number,
    ) {
        return this.commandBus.execute(new DeleteNoteCommand(id, userId));
    }
}
