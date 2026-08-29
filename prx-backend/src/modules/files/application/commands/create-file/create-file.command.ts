import { CreateFileDto } from '@modules/files/application/dto/requests/create-file.dto';

export class CreateFileCommand {
  constructor(
    public readonly dto: CreateFileDto,
    public readonly file: Express.Multer.File,
    public readonly userId: number,
  ) {}
}
