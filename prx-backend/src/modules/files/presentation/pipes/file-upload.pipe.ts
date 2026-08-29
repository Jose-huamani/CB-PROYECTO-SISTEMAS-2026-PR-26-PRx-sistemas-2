import { HttpStatus, ParseFilePipeBuilder } from '@nestjs/common';

import { FILE_CONSTANTS } from '@modules/files/application/constants/file.constants';
import { FILE_MESSAGES } from '@modules/files/application/constants/file-messages.constants';

export const FileUploadPipe = new ParseFilePipeBuilder()
  .addMaxSizeValidator({
    maxSize: FILE_CONSTANTS.MAX_FILE_SIZE_IN_BYTES,
    message: FILE_MESSAGES.FILE_TOO_LARGE,
  })
  .build({
    fileIsRequired: true,
    errorHttpStatusCode: HttpStatus.BAD_REQUEST,
  });
