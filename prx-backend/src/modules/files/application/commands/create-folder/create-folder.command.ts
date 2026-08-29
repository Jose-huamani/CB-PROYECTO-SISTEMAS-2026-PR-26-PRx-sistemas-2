import { CreateFolderDto } from '@modules/files/application/dto/requests/create-folder.dto';

export class CreateFolderCommand {
  constructor(
    public readonly dto: CreateFolderDto,
    public readonly userId: number,
  ) {}
}
