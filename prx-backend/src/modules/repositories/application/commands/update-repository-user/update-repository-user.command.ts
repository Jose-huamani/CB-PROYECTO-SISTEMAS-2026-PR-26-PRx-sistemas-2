import { UpdateRepositoryUserDto } from '@modules/repositories/application/dto/requests/update-repository-user.dto';

export class UpdateRepositoryUserCommand {
  constructor(
    public readonly repositoryId: number,
    public readonly targetUserId: number,
    public readonly dto: UpdateRepositoryUserDto,
    public readonly requestUserId: number,
  ) {}
}
