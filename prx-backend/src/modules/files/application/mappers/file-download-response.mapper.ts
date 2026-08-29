import { FileDownloadResponseDto } from '@modules/files/application/dto/responses/file-download-response.dto';
import { FileEntity } from '@modules/files/domain/entities/file.entity';

export class FileDownloadResponseMapper {
  static toFileDownloadResponse(
    file: FileEntity,
    url: string,
  ): FileDownloadResponseDto {
    return {
      url,
      fileName: `${file.name}.${file.extension}`,
    };
  }
}
