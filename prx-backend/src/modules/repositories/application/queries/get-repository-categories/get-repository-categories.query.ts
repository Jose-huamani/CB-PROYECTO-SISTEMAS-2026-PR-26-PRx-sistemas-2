import { GetRepositoryCategoriesDto } from '@modules/repositories/application/dto/requests/get-repository-categories.dto';

export class GetRepositoryCategoriesQuery {
  constructor(public readonly dto: GetRepositoryCategoriesDto) {}
}
