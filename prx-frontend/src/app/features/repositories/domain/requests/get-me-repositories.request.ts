import { RepositoryVisibility } from '@shared/enums/repository-visibility.enum';

export interface GetMeRepositoriesRequest {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  category?: string;
  visibility?: RepositoryVisibility;
}
