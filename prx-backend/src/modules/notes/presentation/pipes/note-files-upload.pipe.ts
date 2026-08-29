import { HttpStatus, ParseFilePipeBuilder } from '@nestjs/common';

import { NOTE_CONSTANTS } from '@modules/notes/application/constants/note.constants';
import { NOTE_MESSAGES } from '@modules/notes/application/constants/note-messages.constants';

export const NoteFilesUploadPipe = new ParseFilePipeBuilder()
    .addMaxSizeValidator({
        maxSize: NOTE_CONSTANTS.MAX_FILE_SIZE_IN_BYTES,
        message: NOTE_MESSAGES.FILE_TOO_LARGE,
    })
    .build({
        fileIsRequired: false,
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
    });
