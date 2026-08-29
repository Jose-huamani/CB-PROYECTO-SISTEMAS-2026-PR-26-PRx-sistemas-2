import { GetPublicRepositoriesByUserDto } from '@modules/repositories/application/dto/requests/get-public-repositories-by-user.dto';

export class GetPublicRepositoriesByUserQuery {
  constructor(
    public readonly userId: number,
    public readonly dto: GetPublicRepositoriesByUserDto,
  ) {}
}
