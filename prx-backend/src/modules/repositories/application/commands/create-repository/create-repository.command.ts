import { CreateRepositoryDto } from '@modules/repositories/application/dto/requests/create-repository.dto';

export class CreateRepositoryCommand {
  constructor(
    public readonly dto: CreateRepositoryDto,
    public readonly userId: number,
  ) {}
}
