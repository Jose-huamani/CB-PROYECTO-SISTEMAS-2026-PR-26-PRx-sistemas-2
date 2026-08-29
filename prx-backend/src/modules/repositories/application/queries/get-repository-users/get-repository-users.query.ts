import { GetRepositoryUsersDto } from '@modules/repositories/application/dto/requests/get-repository-users.dto';

export class GetRepositoryUsersQuery {
  constructor(
    public readonly repositoryId: number,
    public readonly dto: GetRepositoryUsersDto,
    public readonly userId: number,
  ) {}
}
