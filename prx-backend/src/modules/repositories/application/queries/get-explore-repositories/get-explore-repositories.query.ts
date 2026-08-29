import { GetExploreRepositoriesDto } from '@modules/repositories/application/dto/requests/get-explore-repositories.dto';

export class GetExploreRepositoriesQuery {
  constructor(public readonly dto: GetExploreRepositoriesDto) {}
}
