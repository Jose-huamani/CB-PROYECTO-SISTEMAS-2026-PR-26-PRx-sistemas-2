import { UpdateFolderDto } from '@modules/files/application/dto/requests/update-folder.dto';

export class UpdateFolderCommand {
  constructor(
    public readonly folderId: number,
    public readonly dto: UpdateFolderDto,
    public readonly userId: number,
  ) {}
}
