import { UpdateRepositoryDto } from '@modules/repositories/application/dto/requests/update-repository.dto';

export class UpdateRepositoryCommand {
  constructor(
    public readonly id: number,
    public readonly dto: UpdateRepositoryDto,
    public readonly userId: number,
  ) {}
}
