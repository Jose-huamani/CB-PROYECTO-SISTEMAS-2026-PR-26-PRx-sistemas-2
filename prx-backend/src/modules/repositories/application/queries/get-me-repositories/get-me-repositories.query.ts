import { GetMeRepositoriesDto } from '@modules/repositories/application/dto/requests/get-me-repositories.dto';

export class GetMeRepositoriesQuery {
  constructor(
    public readonly dto: GetMeRepositoriesDto,
    public readonly userId: number,
  ) {}
}
